/**
 * Direct Railway MySQL auth for Netlify functions.
 * Used when MYSQL_* env is set — no Go backend required for register/login.
 */
const crypto = require('crypto');

let mysql;
let bcrypt;
try {
  mysql = require('mysql2/promise');
} catch {
  mysql = null;
}
try {
  bcrypt = require('bcryptjs');
} catch {
  bcrypt = null;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-admin-secret',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

function options() {
  return json(200, { ok: true });
}

function envFirst(...keys) {
  for (const k of keys) {
    const v = process.env[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

/** True when Railway/MySQL connection can be built from env. */
function hasMysqlConfig() {
  // Connection URL styles
  if (envFirst('MYSQL_URL', 'DATABASE_URL', 'MYSQL_PUBLIC_URL', 'MYSQL_PRIVATE_URL')) return true;
  // Split vars — standard + Railway naming (MYSQLHOST / MYSQLUSER / …)
  const host = envFirst('MYSQL_HOST', 'MYSQLHOST', 'DB_HOST');
  const user = envFirst('MYSQL_USER', 'MYSQLUSER', 'DB_USER', 'DB_USERNAME');
  const password = envFirst('MYSQL_PASSWORD', 'MYSQLPASSWORD', 'DB_PASSWORD');
  return Boolean(host && user && typeof password === 'string' && password.length > 0);
}

function depsReady() {
  return Boolean(mysql && bcrypt);
}

async function getPool() {
  if (!depsReady()) {
    throw new Error('mysql2/bcryptjs not installed in functions bundle');
  }
  if (global.__edurouteMysqlPool) return global.__edurouteMysqlPool;

  const url = envFirst('MYSQL_URL', 'DATABASE_URL', 'MYSQL_PUBLIC_URL', 'MYSQL_PRIVATE_URL');
  let config;
  if (url) {
    config = url;
  } else {
    const hostRaw = envFirst('MYSQL_HOST', 'MYSQLHOST', 'DB_HOST');
    const host = hostRaw.replace(/:\d+$/, '');
    const port = Number(envFirst('MYSQL_PORT', 'MYSQLPORT', 'DB_PORT') || 3306);
    const user = envFirst('MYSQL_USER', 'MYSQLUSER', 'DB_USER', 'DB_USERNAME');
    const password = envFirst('MYSQL_PASSWORD', 'MYSQLPASSWORD', 'DB_PASSWORD');
    const database = envFirst('MYSQL_DATABASE', 'MYSQLDATABASE', 'DB_NAME', 'MYSQL_DB') || 'railway';
    const sslFlag = (envFirst('MYSQL_SSL', 'DB_SSL') || '').toLowerCase();
    config = {
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 4,
      ssl: sslFlag === 'true' || sslFlag === '1' ? { rejectUnauthorized: false } : undefined,
      timezone: 'Z',
    };
  }

  const pool = mysql.createPool(config);
  global.__edurouteMysqlPool = pool;
  return pool;
}

async function ensureUsersTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('student','admin') NOT NULL DEFAULT 'student',
      is_verified BOOLEAN NOT NULL DEFAULT FALSE,
      college_verified ENUM('none','pending','verified','rejected') NOT NULL DEFAULT 'none',
      points INT NOT NULL DEFAULT 0,
      language_preference ENUM('en','hi','hinglish') NOT NULL DEFAULT 'en',
      avatar VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

function issueToken(user) {
  const secret = process.env.JWT_SECRET || 'eduroute-dev-secret-change-me';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }),
  ).toString('base64url');
  const data = `${header}.${payload}`;
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function toUser(row) {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    role: row.role === 'admin' ? 'admin' : 'student',
    verificationStatus: row.college_verified || 'none',
  };
}

async function register({ name, email, password }) {
  const pool = await getPool();
  await ensureUsersTable(pool);

  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPass = String(password || '');

  if (!cleanName || !cleanEmail || !cleanPass) {
    return json(400, { success: false, error: 'Name, email and password are required' });
  }
  if (cleanPass.length < 6) {
    return json(400, { success: false, error: 'Password must be at least 6 characters' });
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
  if (existing.length > 0) {
    return json(409, { success: false, error: 'Email already registered' });
  }

  const hash = await bcrypt.hash(cleanPass, 12);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role, college_verified) VALUES (?, ?, ?, 'student', 'pending')",
    [cleanName, cleanEmail, hash],
  );

  const user = {
    id: String(result.insertId),
    name: cleanName,
    email: cleanEmail,
    role: 'student',
    verificationStatus: 'pending',
  };
  const token = issueToken(user);
  return json(201, { success: true, token, user });
}

async function login({ email, password, role }) {
  const pool = await getPool();
  await ensureUsersTable(pool);

  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPass = String(password || '');
  const wantedRole = role === 'admin' ? 'admin' : 'student';

  if (!cleanEmail || !cleanPass) {
    return json(400, { success: false, error: 'Email and password are required' });
  }

  const [rows] = await pool.query(
    'SELECT id, name, email, password, role, college_verified FROM users WHERE email = ? LIMIT 1',
    [cleanEmail],
  );

  if (!rows.length) {
    return json(401, { success: false, error: 'Invalid credentials' });
  }

  const row = rows[0];
  const match = await bcrypt.compare(cleanPass, row.password);
  if (!match) {
    return json(401, { success: false, error: 'Invalid credentials' });
  }
  if (row.role !== wantedRole) {
    return json(403, {
      success: false,
      error: `Unauthorized for ${wantedRole} login`,
    });
  }

  const user = toUser(row);
  const token = issueToken(user);
  return json(200, { success: true, token, user });
}

async function ensureDefaultAdmin() {
  try {
    const pool = await getPool();
    await ensureUsersTable(pool);
    const email = 'admin@gmail.com';
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length) return;
    const hash = await bcrypt.hash('timepass', 12);
    await pool.query(
      "INSERT INTO users (name, email, password, role, is_verified, college_verified) VALUES (?, ?, ?, 'admin', TRUE, 'verified')",
      ['EduRoute Admin', email, hash],
    );
  } catch (err) {
    console.warn('ensureDefaultAdmin', err.message);
  }
}

module.exports = {
  json,
  options,
  hasMysqlConfig,
  depsReady,
  register,
  login,
  ensureDefaultAdmin,
};
