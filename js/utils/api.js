// api.js: Utility to call OpenAI API
// NOTE: Replace 'YOUR_OPENAI_API_KEY' with a real key or load from settings/localStorage

// Utility to build a valid OpenAI messages array
export function buildOpenAIMessages(userMessage, config = {}) {
  const systemPrompt = config.systemPrompt || "You are a helpful assistant.";
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];
}

// Utility to build OpenAI API config with defaults and overrides
export function buildOpenAIConfig(config = {}) {
  return {
    model: config.model || 'gpt-4.1',
    temperature: config.temperature !== undefined ? config.temperature : 0.2,
    top_p: config.top_p !== undefined ? config.top_p : 0.9,
    presence_penalty: config.presence_penalty !== undefined ? config.presence_penalty : 0,
    frequency_penalty: config.frequency_penalty !== undefined ? config.frequency_penalty : 1,
    max_tokens: config.max_tokens !== undefined ? config.max_tokens : 200
  };
}

export default async function callOpenAIApi(messages, config = {}) {
  const apiKey = localStorage.getItem('openai_api_key');
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  // If messages is a string, convert to messages array
  let messagesArr = messages;
  if (typeof messages === 'string') {
    messagesArr = buildOpenAIMessages(messages, config);
  }

  // Build config for OpenAI API
  const apiConfig = buildOpenAIConfig(config);

  const body = {
    ...apiConfig,
    messages: messagesArr
  };

  console.log('OpenAI API request:', body);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  const result = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content.trim() : '[No result]';
  return result;
}
