// api/generate.js
// Vercel serverless function. Holds the Anthropic key and relays one request.
// The browser never sees the key.

// Without this, Vercel kills the function on its own short default duration,
// well before a large max_tokens completion (like the avatar synthesis call)
// can finish. 60 is the max allowed on the Hobby plan without upgrading.
export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Interim access gate, added ahead of real auth (Supabase, still pending).
    // The production URL has no login in front of it yet, so without this check
    // anyone who finds the URL could call this endpoint directly and run up real
    // Anthropic spend with no rate limit. Requires APP_ACCESS_CODE to be set on
    // the server; the app asks the visitor for it once per browser session and
    // sends it back on every call. Remove this block once real auth ships.
    if (!process.env.APP_ACCESS_CODE) {
      return res.status(500).json({ error: "Server is missing APP_ACCESS_CODE" });
    }
    const suppliedCode = req.headers["x-app-passcode"];
    if (suppliedCode !== process.env.APP_ACCESS_CODE) {
      return res.status(401).json({ error: "Missing or incorrect access code" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const prompt = body.prompt;
    // We own the ceiling. 1500 fixes the avatar truncation. Cap it so nobody abuses it.
    const max_tokens = Math.min(Math.max(parseInt(body.max_tokens, 10) || 1500, 256), 4096);
    const model = body.model || "claude-sonnet-4-6";
    // Optional prompt caching. The browser sends this only when a call has a large
    // enough static prefix to be worth caching (see buildProofPairing in App.jsx).
    // Everything else on this endpoint works exactly as before when system is absent.
    // Accepts either a plain string or the Anthropic content-block array shape, e.g.
    // [{ type: "text", text: "...", cache_control: { type: "ephemeral" } }].
    const system = body.system;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }
    if (prompt.length > 20000) {
      return res.status(400).json({ error: "Prompt too long" });
    }
    if (system !== undefined && typeof system !== "string" && !Array.isArray(system)) {
      return res.status(400).json({ error: "system must be a string or an array of content blocks" });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
    }

    // TODO before public launch: real per-user auth and rate limiting still needed
    // (Supabase, planned). The shared passcode above is an interim block only, it
    // stops an anonymous stranger, not abuse by someone who has the code. See
    // Anvil_Backend_README.md.

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
        ...(system !== undefined ? { system } : {}),
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

    // usage is additive, existing callers reading only { text } are unaffected.
    // Check cache_read_input_tokens / cache_creation_input_tokens here to confirm
    // whether a given call actually hit the cache, since the 1,024-token minimum
    // (for Sonnet 4.6) means a cache_control marker can silently be a no-op.
    return res.status(200).json({ text, usage: data.usage || null });
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String(e).slice(0, 300) });
  }
}
