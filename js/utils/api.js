// api.js: Utility to call OpenAI API
// NOTE: Replace 'YOUR_OPENAI_API_KEY' with a real key or load from settings/localStorage

export default async function callOpenAIApi(prompt) {

  const apiKey = localStorage.getItem('openai_api_key') 

  const endpoint = 'https://api.openai.com/v1/completions';
  const model = 'gpt-4o-mini';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      prompt,
      max_tokens: 100
    })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  const result = data.choices && data.choices[0] ? data.choices[0].text.trim() : '[No result]';
  return result
}
