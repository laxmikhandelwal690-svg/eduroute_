const { connectDatabase, UserProgress } = require('./_lib/database');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

function fallbackProgress() {
  return {
    points: 0,
    level: 1,
    achievements: ['Welcome to Buddy 🚀'],
    weeklyChallenges: ['Complete 1 mini project this week'],
    missingSkills: [],
    preferredLanguage: 'english',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });

  try {
    const userId = event.queryStringParameters?.userId || JSON.parse(event.body || '{}')?.userId;
    if (!userId) return json(400, { ok: false, error: 'userId is required.' });

    try {
      await connectDatabase();

      const profile = await UserProgress.findOneAndUpdate(
        { userId },
        {
          $setOnInsert: {
            userId,
            weeklyChallenges: ['Complete 3 DSA problems', 'Ship 1 portfolio section update', 'Apply to 2 internships'],
            achievements: ['Welcome to Buddy 🚀'],
          },
        },
        { upsert: true, new: true }
      );

      if (event.httpMethod === 'POST') {
        const { missingSkills = [] } = JSON.parse(event.body || '{}');
        profile.missingSkills = missingSkills;
        await profile.save();
      }

      return json(200, {
        ok: true,
        mode: 'persistent',
        progress: {
          points: profile.points,
          level: profile.level,
          achievements: profile.achievements,
          weeklyChallenges: profile.weeklyChallenges,
          missingSkills: profile.missingSkills,
          preferredLanguage: profile.preferredLanguage,
        },
        history: profile.chatHistory.slice(-20),
      });
    } catch (dbError) {
      console.warn('buddy-progress DB disabled, serving fallback progress', dbError.message);
      const progress = fallbackProgress();

      if (event.httpMethod === 'POST') {
        const { missingSkills = [] } = JSON.parse(event.body || '{}');
        progress.missingSkills = missingSkills;
      }

      return json(200, {
        ok: true,
        mode: 'stateless',
        progress,
        history: [],
      });
    }
  } catch (error) {
    console.error('buddy-progress error', error);
    return json(500, { ok: false, error: error.message || 'Failed to fetch progress.' });
  }
};
