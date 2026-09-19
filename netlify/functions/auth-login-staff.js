/** POST /api/auth/login/staff — MySQL bcrypt check (or Go proxy). */
const mysqlAuth = require('./_lib/mysqlAuth');
const { proxyToGo } = require('./_lib/goProxy');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return mysqlAuth.options();
  if (event.httpMethod !== 'POST') {
    return mysqlAuth.json(405, { success: false, error: 'Method not allowed' });
  }

  if (mysqlAuth.hasMysqlConfig() && mysqlAuth.depsReady()) {
    try {
      await mysqlAuth.ensureDefaultAdmin();
      const body = JSON.parse(event.body || '{}');
      return await mysqlAuth.login({
        email: body.email,
        password: body.password,
        role: 'admin',
      });
    } catch (err) {
      console.error('auth-login-staff mysql', err);
      return mysqlAuth.json(500, {
        success: false,
        error: err.message || 'Staff login failed',
      });
    }
  }

  // Prefer Go proxy only when configured; otherwise surface a clear config error
  if (!process.env.GO_API_URL && !process.env.BACKEND_URL) {
    return mysqlAuth.json(503, {
      success: false,
      error:
        'Auth database not configured. In Netlify → Site settings → Environment variables, add MYSQL_URL (Railway MySQL connection string) or MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE. Optionally set JWT_SECRET.',
    });
  }

  return proxyToGo.forward(event, '/api/auth/login/staff');
};
