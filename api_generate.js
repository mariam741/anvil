// api/generate.js
// Vercel serverless function. Place at the project root in /api/generate.js.
// It holds your Anthropic key and relays one request. The browser never sees the key.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const prompt = body.prompt;
    // We now own the ceiling. 1500 fixes the avatar truncation. Cap it so nobody abuses it.
    const max_tokens = Math.min(Math.max(parseInt(body.max_tokens, 10) || 1500, 256), 4096);
    const model = body.model || "claude-sonnet-4-6";

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }
    if (prompt.length > 20000) {
      return res.status(400).json({ error: "Prompt too long" });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
    }

    // TODO before public launch: rate limit and auth here. See README.

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,   // required on the real API
        "anthropic-version": "2023-06-01",            // required on the real API
      },
      body: JSON.stringify({
        model,
        max_tokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!upstream.ok) {
      const detail = (await upstream.text()).slice(0, 500);
      return res.status(upstream.status).json({ error: "Upstream error", detail });
    }

    const data = await upstream.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String(e).slice(0, 300) });
  }
}
