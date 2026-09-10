const { connectDatabase, Course } = require('./_lib/database');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-admin-secret',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
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

function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return {};
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });

  try {
    await connectDatabase();

    if (event.httpMethod === 'GET') {
      const courses = await Course.find({ published: true }).sort({ createdAt: -1 });
      return json(200, { ok: true, data: courses });
    }

    if (!checkAdmin(event)) {
      return json(401, { ok: false, error: 'Unauthorized admin request.' });
    }

    if (event.httpMethod === 'POST') {
      const payload = parseBody(event);
      const requiredFields = ['title', 'description', 'category', 'duration', 'instructor'];
      const missing = requiredFields.find((field) => !payload[field]);

      if (missing) {
        return json(400, { ok: false, error: `Missing required field: ${missing}` });
      }

      const course = await Course.create({
        title: payload.title,
        description: payload.description,
        category: payload.category,
        level: payload.level || 'Beginner',
        duration: payload.duration,
        instructor: payload.instructor,
        thumbnail: payload.thumbnail || '',
        createdBy: payload.createdBy || 'admin',
        published: payload.published !== false,
      });

      return json(201, { ok: true, data: course });
    }

    if (event.httpMethod === 'PUT') {
      const id = event.queryStringParameters?.id;
      if (!id) return json(400, { ok: false, error: 'id query parameter is required.' });

      const payload = parseBody(event);
      const updatedCourse = await Course.findByIdAndUpdate(id, payload, { new: true });
      if (!updatedCourse) {
        return json(404, { ok: false, error: 'Course not found' });
      }

      return json(200, { ok: true, data: updatedCourse });
    }

    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id;
      if (!id) return json(400, { ok: false, error: 'id query parameter is required.' });

      const deletedCourse = await Course.findByIdAndDelete(id);
      if (!deletedCourse) {
        return json(404, { ok: false, error: 'Course not found' });
      }

      return json(200, { ok: true, message: 'Course deleted successfully' });
    }

    return json(405, { ok: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('courses error', error);
    return json(500, { ok: false, error: error.message || 'Failed to process courses.' });
  }
};
