const ROADMAP_FALLBACK = `For roadmaps, structure answers as:\n1) Beginner (3-4 milestones)\n2) Intermediate (3-4 milestones)\n3) Pro (3-4 milestones)\nInclude skills, one practical project, and one weekly challenge.`;

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

  if (provider === 'gemini') {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required when AI_PROVIDER=gemini');
    }
    return callGemini({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL,
      messages: [systemMessage, ...messages],
      temperature,
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai');
  }

  return callOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL,
    messages: [systemMessage, ...messages],
    temperature,
  });
}

module.exports = { generateBuddyReply };
