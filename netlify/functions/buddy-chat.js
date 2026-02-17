const { connectDatabase, UserProgress } = require('./_lib/database');
const { generateBuddyReply } = require('./_lib/aiClient');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  try {
    const payload = JSON.parse(event.body || '{}');
    const { userId, message, language = 'english' } = payload;

    if (!userId || !message) {
      return json(400, { ok: false, error: 'userId and message are required.' });
    }

    await connectDatabase();

    const profile = await UserProgress.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, weeklyChallenges: ['Build 1 mini project this week'] } },
      { upsert: true, new: true }
    );

    profile.chatHistory.push({ role: 'user', text: message });

    const recentMessages = profile.chatHistory
      .slice(-12)
      .map((entry) => ({ role: entry.role === 'assistant' ? 'assistant' : 'user', content: entry.text }));

    const aiReply = await generateBuddyReply({ messages: recentMessages, language });

    const pointsEarned = 5;
    const newPoints = (profile.points || 0) + pointsEarned;
    const newLevel = Math.max(1, Math.floor(newPoints / 100) + 1);

    profile.points = newPoints;
    profile.level = newLevel;
    profile.preferredLanguage = language;
    profile.chatHistory.push({ role: 'assistant', text: aiReply });

    if (profile.chatHistory.length > 50) {
      profile.chatHistory = profile.chatHistory.slice(-50);
    }

    await profile.save();

    return json(200, {
      ok: true,
      reply: aiReply,
      gamification: {
        points: newPoints,
        level: newLevel,
        pointsEarned,
      },
    });
  } catch (error) {
    console.error('buddy-chat error', error);
    return json(500, { ok: false, error: error.message || 'Failed to process Buddy chat.' });
  }
};
