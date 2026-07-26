const { onCall } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions');

setGlobalOptions({ maxInstances: 10 });

exports.getCharacterReaction = onCall(async (request) => {
  console.log('getCharacterReaction triggered');
  const { word, outcome, personality, wrongCount } = request.data;

  if (!outcome || !personality) {
    return { line: '...', tone: 'neutral' };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it:free', // completely free model
        messages: [
          {
            role: 'user',
            content: `You are a ${personality} character. React to: player made a ${outcome} guess in hangman (${wrongCount} wrong so far).
JSON only, no markdown: {"line":"one sentence","tone":"praise|taunt|panic|concern|smug"}`
          }
        ],
      })
    });

    const data = await response.json();
    console.log('OpenRouter response:', data);

    const raw = data.choices?.[0]?.message?.content?.trim();
    try {
      return JSON.parse(raw);
    } catch {
      console.error('JSON parse failed:', raw);
      return { line: '...', tone: 'neutral' };
    }

  } catch (err) {
    console.error('OpenRouter call failed:', err.message);
    return { line: '...', tone: 'neutral' };
  }
});

exports.getWordFact = onCall(async (request) => {
  console.log('getWordFact triggered');
  const { word } = request.data;

  if (!word || typeof word !== 'string') {
    return { fact: null };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it:free',
        messages: [
          {
            role: 'user',
            content: `Give me one short, interesting fun fact about the word "${word}". One sentence only, no preamble.`
          }
        ],
      })
    });

    const data = await response.json();
    const fact = data.choices?.[0]?.message?.content?.trim();
    console.log('Word fact:', fact);
    return { fact: fact || null };

  } catch (err) {
    console.error('OpenRouter call failed:', err.message);
    return { fact: null };
  }
});