/**
 * POST /api/auth/register
 * Prefer direct MySQL (Railway). Fallback: proxy to GO_API_URL if set.
 */
const mysqlAuth = require('./_lib/mysqlAuth');
const { proxyToGo } = require('./_lib/goProxy');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return mysqlAuth.options();
  if (event.httpMethod !== 'POST') {
    return mysqlAuth.json(405, { success: false, error: 'Method not allowed' });
  }

  const hasMysql = mysqlAuth.hasMysqlConfig();
  const depsOk = mysqlAuth.depsReady();

  if (hasMysql && !depsOk) {
    return mysqlAuth.json(500, {
      success: false,
      error: 'Server missing mysql2/bcryptjs. Check Netlify function dependencies.',
    });
  }

  if (hasMysql && depsOk) {
    try {
      const body = JSON.parse(event.body || '{}');
      return await mysqlAuth.register({
        name: body.name,
        email: body.email,
        password: body.password,
      });
    } catch (err) {
      console.error('auth-register mysql', err);
      return mysqlAuth.json(500, {
        success: false,
        error: err.message || 'Unable to register user',
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

  return proxyToGo.forward(event, '/api/auth/register');
};
