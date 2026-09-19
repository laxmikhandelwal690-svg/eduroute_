/**
 * Shared proxy to the Go + MySQL API.
 * Netlify env: GO_API_URL (preferred) or BACKEND_URL — base without trailing slash,
 * e.g. https://api.eduroute.example.com  or  http://localhost:5000
 */
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

function resolveGoBase() {
  const raw = (process.env.GO_API_URL || process.env.BACKEND_URL || '').trim().replace(/\/$/, '');
  return raw;
}

async function forward(event, path) {
  const base = resolveGoBase();
  if (!base) {
    return json(503, {
      success: false,
      error:
        'MySQL is not configured on Netlify. Set MYSQL_URL (or MYSQL_HOST + MYSQL_USER + MYSQL_PASSWORD from Railway), or set GO_API_URL to your Go backend.',
    });
  }

  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (event.headers?.authorization || event.headers?.Authorization) {
      headers.Authorization = event.headers.authorization || event.headers.Authorization;
    }

    const response = await fetch(url, {
      method: event.httpMethod || 'POST',
      headers,
      body: event.body || undefined,
    });

    const contentType = response.headers.get('content-type') || '';
    let payload;

    if (contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = {
        success: false,
        error: text?.slice(0, 200) || `Upstream error (${response.status})`,
      };
    }

    return json(response.status, payload);
  } catch (err) {
    console.error('goProxy error', path, err);
    return json(502, {
      success: false,
      error: 'Unable to reach Go/MySQL backend. Check GO_API_URL and that the API is running.',
    });
  }
}

const proxyToGo = { json, options, forward, resolveGoBase };

module.exports = { proxyToGo };
