export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY is not set' }), { status: 500 });
    }

    // Safe, env-driven settings
    const model = process.env.MODEL || 'gpt-4o-mini';
    const temperature = Number(process.env.TEMPERATURE ?? 0.3);
    const max_tokens = process.env.MAX_TOKENS ? Number(process.env.MAX_TOKENS) : undefined;
    const top_p = process.env.TOP_P ? Number(process.env.TOP_P) : undefined;
    const systemPrompt = process.env.SYSTEM_PROMPT || 'You are a friendly, concise assistant. Keep answers short unless asked for detail.';

    // Ensure a system prompt exists server-side
    const finalMessages = messages.slice();
    if (!finalMessages.some(m => m.role === 'system')) {
      finalMessages.unshift({ role: 'system', content: systemPrompt });
    }

    const payload = {
      model,
      temperature,
      messages: finalMessages
    };
    if (typeof max_tokens === 'number') payload.max_tokens = max_tokens;
    if (typeof top_p === 'number') payload.top_p = top_p;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      return new Response(JSON.stringify({ error: 'Upstream error', details: txt }), { status: 502 });
    }

    const data = await openaiRes.json();
    const reply = data?.choices?.[0]?.message?.content ?? '';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', details: String(err) }), { status: 500 });
  }
}
