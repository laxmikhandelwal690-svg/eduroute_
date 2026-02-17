const { connectDatabase, Roadmap } = require('./_lib/database');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,x-admin-secret',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

function checkAdmin(event) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return true;
  const supplied = event.headers['x-admin-secret'] || event.headers['X-Admin-Secret'];
  return supplied === expected;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });

  if (!checkAdmin(event)) {
    return json(401, { ok: false, error: 'Unauthorized admin request.' });
  }

  try {
    await connectDatabase();

    if (event.httpMethod === 'GET') {
      const roadmaps = await Roadmap.find().sort({ updatedAt: -1 });
      return json(200, { ok: true, roadmaps });
    }

    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body || '{}');
      if (!payload.role) return json(400, { ok: false, error: 'role is required.' });

      const roadmap = await Roadmap.findOneAndUpdate(
        { role: payload.role },
        {
          role: payload.role,
          beginner: payload.beginner || [],
          intermediate: payload.intermediate || [],
          pro: payload.pro || [],
          updatedBy: payload.updatedBy || 'admin',
        },
        { upsert: true, new: true }
      );

      return json(200, { ok: true, roadmap });
    }

    return json(405, { ok: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('admin-roadmaps error', error);
    return json(500, { ok: false, error: error.message || 'Failed to process roadmaps.' });
  }
};
