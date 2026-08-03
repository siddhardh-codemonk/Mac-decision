// /functions/api/verdict.js
// Cloudflare Pages Function — POST /api/verdict
// Takes the structured answers from the question flow and calls Groq
// ONCE to generate a short personalized verdict. No open-ended chat here —
// that's what keeps this cheap and on-script.

const SYSTEM_PROMPT = `You are the verdict-writer for mac-decision, a small honest OS decision-guide site.
A user has just answered a short set of questions about why they think they need a Mac.
You will receive their answers as JSON. Write a short, direct, honest verdict.

Rules:
- Never be preachy or moralize about spending money. Just be honest and specific.
- If their real reason is social pressure (friends, classmates, "everyone has one"),
  gently name that pattern without being condescending — people know when they're
  being talked down to.
- If they have a genuine technical need (iOS development requiring Xcode, Final Cut,
  Logic Pro, or similar Mac-only tools), say so clearly and don't talk them out of it.
- Always mention at least one concrete alternative path relevant to their specific
  answers: a cloud Mac option, a secondhand/refurbished Mac, a cross-platform tool,
  or a Hackintosh, but only if it's genuinely relevant to their situation.
- Keep it to 3-5 short sentences. No headers, no bullet lists, no markdown.
- Write like a knowledgeable friend, not a salesperson and not a lecture.
- Never invent prices or specs you're not given. Keep any price references general.
- Do not mention that you are an AI or that this is a generated response.

Output plain text only. No JSON, no markdown formatting.`;

export async function onRequestPost(context) {
  const { request, env } = context;

  let answers;
  try {
    answers = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Basic guardrail: cap payload size so someone can't stuff a huge blob in "notes"
  if (JSON.stringify(answers).length > 4000) {
    return new Response(JSON.stringify({ error: "Payload too large" }), {
      status: 413,
      headers: { "content-type": "application/json" },
    });
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.GROQ_API_KEY}`, // set via `wrangler secret` / Pages env vars
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(answers) },
      ],
    }),
  });

  if (!groqRes.ok) {
    const errText = await groqRes.text();
    return new Response(JSON.stringify({ error: "Groq request failed", detail: errText }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  const data = await groqRes.json();
  const verdict = data.choices?.[0]?.message?.content?.trim() ?? "";

  return new Response(JSON.stringify({ verdict }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

// Reject non-POST methods explicitly
export async function onRequestGet() {
  return new Response("Method not allowed", { status: 405 });
}
