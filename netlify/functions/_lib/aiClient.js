const ROADMAP_FALLBACK = `For roadmaps, structure answers as:\n1) Beginner (3-4 milestones)\n2) Intermediate (3-4 milestones)\n3) Pro (3-4 milestones)\nInclude skills, one practical project, and one weekly challenge.`;

function localFallbackReply({ messages, language }) {
  const lastMessage = messages[messages.length - 1]?.content || 'learning guidance';
  const intro = language === 'hindi'
    ? 'मैं Buddy हूँ। अभी limited mode में हूँ, लेकिन आपकी पूरी help करूंगा।'
    : language === 'hinglish'
      ? 'Main Buddy hoon. Abhi limited mode hai, but main full guidance dunga.'
      : 'I am Buddy in limited mode, but I can still guide you effectively.';

  return `${intro}

Based on: "${lastMessage}"

Beginner → Intermediate → Pro Plan:
1) Beginner: strengthen fundamentals + 1 mini project.
2) Intermediate: framework mastery + API integration + portfolio update.
3) Pro: system design, testing, interview prep, and internship applications.

Weekly challenge: complete one project milestone and one mock interview.`;
}

async function callOpenAI({ apiKey, model, messages, temperature }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Buddy could not generate a response.';
}

async function callGemini({ apiKey, model, messages, temperature }) {
  const prompt = messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini error: ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Buddy could not generate a response.';
}

async function generateBuddyReply({ messages, language = 'english' }) {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const temperature = 0.6;
  const languageDirective = {
    english: 'Reply in English only.',
    hindi: 'Reply in Hindi only (Devanagari script).',
    hinglish: 'Reply in friendly Hinglish using simple Roman script words.',
  }[language] || 'Reply in English only.';

  const systemMessage = {
    role: 'system',
    content: `You are Buddy, EDUROUTE's friendly student mentor AI. Help with: learning roadmaps, skill-gap analysis, internship guidance, resume and portfolio suggestions, weekly motivation, and event recommendations. ${ROADMAP_FALLBACK} ${languageDirective} Keep responses safe, non-harmful, and education focused. Refuse harmful/unrelated requests politely.`,
  };

  try {
    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      return await callGemini({
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL,
        messages: [systemMessage, ...messages],
        temperature,
      });
    }

    if (process.env.OPENAI_API_KEY) {
      return await callOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL,
        messages: [systemMessage, ...messages],
        temperature,
      });
    }

    return localFallbackReply({ messages, language });
  } catch (error) {
    console.error('AI provider failed, using fallback response', error);
    return localFallbackReply({ messages, language });
  }
}

module.exports = { generateBuddyReply };
