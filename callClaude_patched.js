// callClaude (patched for your own backend)
// Replace the existing callClaude function in App.jsx (the Anvil component) with this one.
// The only change is the URL and the response shape. Your retry logic is preserved.
// Because /api is served from the same Vercel project as the app, there is no CORS or key in the browser.

async function callClaude(prompt) {
  for (let attempt = 0; attempt < 2; attempt++) {
    let res;
    try {
      res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, max_tokens: 1500 }),
      });
    } catch (netErr) {
      if (attempt === 0) { await new Promise((r) => setTimeout(r, 1200)); continue; }
      throw new Error("Network error. Check your connection and try again.");
    }
    if (!res.ok) {
      const transient = [429, 500, 502, 503, 529].includes(res.status);
      if (transient && attempt === 0) { await new Promise((r) => setTimeout(r, 1200)); continue; }
      let detail = "";
      try { detail = (await res.json()).error || ""; } catch (e) {}
      throw new Error("Request failed (" + res.status + (res.status === 429 ? ", rate limited" : res.status === 529 ? ", overloaded" : "") + ")" + (detail ? ": " + detail : ""));
    }
    const data = await res.json();
    return data.text || "";
  }
}
