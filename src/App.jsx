import React, { useState, useMemo, useRef } from "react";

/*
  ANVIL  by Prompted Forge  (v6)
  Adds campaign objective + responsive search ads.

  - Objective: Lead generation or Direct sale. In lead-gen mode the CTA and the
    Conditions block default to the lead magnet (free consult, inspection, quote)
    instead of trying to close the sale in the ad.
  - Google Search now outputs a real responsive search ad: up to 15 headlines
    and 4 descriptions with character-limit checks and a SERP preview, instead
    of one headline and one description.

  Pipeline: paste market language -> research pass -> quote-backed avatar ->
  six blocks -> template -> ad / A/B test set / search asset set, per placement.
*/

const BLOCKS = {
  Pain:        { color: "#E8242B", tint: "#FBE4E5", ink: "#7A0E12", desc: "The thing they DON'T want. The cost of staying stuck.", method: "layered pain" },
  Promise:     { color: "#1B7A43", tint: "#E1F1E7", ink: "#0C3D21", desc: "The thing they DO want. The promised land.", method: "promise ladder" },
  Proof:       { color: "#1B79B5", tint: "#E2EEF6", ink: "#0C3A57", desc: "A reason to believe the promise is real.", method: "proof match" },
  Constraints: { color: "#5F6368", tint: "#EBECED", ink: "#2E3134", desc: "The belief or objection that holds them back.", method: "acknowledge and reframe" },
  Curiosity:   { color: "#B8BB1E", tint: "#F6F7DA", ink: "#5C5E0F", desc: "The new idea that bridges pain and promise. Hooks live here.", method: "fresh angle + insight level" },
  Conditions:  { color: "#8E3B8E", tint: "#F2E4F2", ink: "#4A1E4A", desc: "Qualifier, scarcity, risk reversal, bonus, terms. The CTA wrapper.", method: "offer wrapper" },
};
const BLOCK_NAMES = Object.keys(BLOCKS);

const TEMPLATES = [
  { id: 1, name: "The Before & After", when: "Sharp contrast between a painful state and a dramatically better result.", opening: "Transformation contrast hook", middle: "Vivid pain state + transformation + proof", close: "Bold promise + CTA" },
  { id: 2, name: "The Insider Reveal", when: "You have hidden or exclusive information most people don't have.", opening: "Exclusivity curiosity hook", middle: "Hidden information + proof", close: "Promise + CTA" },
  { id: 3, name: "The Framework", when: "Market is overwhelmed by complexity and wants a clear structured path.", opening: "Complexity contrast hook", middle: "Simplicity promise + system curiosity", close: "Proof + CTA" },
  { id: 4, name: "The Quick Win", when: "You can promise a fast, tangible result that builds momentum.", opening: "Speed-result contrast hook", middle: "Proof + mechanism curiosity", close: "Clear path + CTA" },
  { id: 5, name: "The Industry Authority", when: "Buyer works hard but lacks recognition and wants status.", opening: "Recognition gap hook", middle: "Authority promise + benefits", close: "Timeframe + easy action CTA" },
  { id: 6, name: "The Hidden Cost", when: "An invisible loss is draining the buyer's time, money, or potential.", opening: "Invisible pain hook", middle: "Cost revelation + solution promise", close: "Proof + urgent CTA" },
  { id: 7, name: "The Identity Shift", when: "The buyer's self-image is blocking their results.", opening: "Identity crisis hook", middle: "Identity contrast + transformation", close: "Proof + identity CTA" },
  { id: 8, name: "The Pattern Interrupt Question", when: "Attack a deeply held belief with one shocking question.", opening: "Perspective-shattering question", middle: "True problem revealed + solution", close: "Proof + urgency CTA" },
  { id: 9, name: "The Overlooked Factor", when: "A missing piece explains why the buyer stays stuck despite effort.", opening: "Missing element hook", middle: "Unexpected cause + solution promise", close: "Proof + simple-solution CTA" },
  { id: 10, name: "The Bottleneck Breakthrough", when: "One specific obstacle is why everything else has failed.", opening: "Bottleneck revelation hook", middle: "Breakthrough solution + transformation", close: "Proof + obstacle-removing CTA" },
  { id: 11, name: "The Effortless Pivot", when: "One tiny change unlocks outsized results.", opening: "Tiny-change-big-result hook", middle: "Simplicity proof + mechanism hint", close: "Effortless implementation + CTA" },
  { id: 12, name: "The Future Self Regret Minimizer", when: "Project the buyer forward to a decision they'll regret.", opening: "Future reflection hook", middle: "Decision fork + regret contrast", close: "Legacy choice + CTA" },
  { id: 13, name: "The Insider-Outsider Contrast", when: "Expose the gap between how elites solve this and how others struggle.", opening: "Elite practice contrast hook", middle: "Insider access + exclusive method", close: "Identity elevation + CTA" },
  { id: 14, name: "The Resource Maximizer", when: "Buyer is short on a scarce resource and wants more from less.", opening: "Resource constraint hook", middle: "Efficiency promise + proof", close: "Mechanism curiosity + CTA" },
];

const PLATFORMS = ["Facebook", "Instagram", "TikTok", "YouTube Shorts", "Google Search"];
const FEED = ["Facebook", "Instagram"];
const CTA_OPTIONS = ["Learn More", "Sign Up", "Get Offer", "Shop Now", "Subscribe", "Download", "Contact Us", "Book Now", "Get Quote"];
const LEADGEN_CTAS = ["Book Now", "Get Quote", "Sign Up", "Contact Us", "Learn More", "Get Offer"];
const SALES_CTAS = ["Shop Now", "Sign Up", "Subscribe", "Download", "Get Offer", "Learn More"];
const OBJECTIVES = ["Lead generation", "Direct sale"];
const VOICES = {
  "Plain & credible": {
    tag: "local SMBs, trust markets",
    rule: "VOICE: plain, calm, and credible. Write at a fifth-grade reading level in short declarative sentences. Be concrete and specific. Lead with proof, time saved, and money or leads gained, not hype. No manufactured urgency or fake scarcity. No hype superlatives, clickbait, taboo, or shock framing. No em-dashes. Never use the contrastive negation-then-restate construction (any subject, not just 'it': '[X] is not A, [it/that/X] is B', in one sentence or split across two sentences, such as '[X] is not A. It is B.'). Keep Curiosity at a credible insight level (insight level about 5 to 7), never outlandish. Make no medical, legal, financial, or income claims you cannot substantiate. No Taboo Solution frames, no shock or taboo characterizations, and no idea caricatures.",
  },
  "Ambitious & direct": {
    tag: "operators, agency builders",
    rule: "VOICE: ambitious, direct, and credible, for an audience that is tired of gurus and burned by courses that never shipped. Energy is welcome, hype is not. No guru cliches (no 'six figures while you sleep', no 'secret loophole'). Every bold promise must be backed by specific proof. Favor real mechanics and specifics over spectacle. Keep Curiosity provable (insight level about 6 to 8). No em-dashes. Never use the contrastive negation-then-restate construction (any subject, not just 'it': '[X] is not A, [it/that/X] is B', in one sentence or split across two sentences, such as '[X] is not A. It is B.'). No Taboo Solution frames or shock characterizations.",
  },
  "Raw direct-response": {
    tag: "supplements, info, not local",
    rule: "VOICE: classic aggressive direct-response, high curiosity and bold promises (insight level 6 to 9). No em-dashes. Never use the contrastive negation-then-restate construction (any subject, not just 'it': '[X] is not A, [it/that/X] is B', in one sentence or split across two sentences, such as '[X] is not A. It is B.'). Use only where the market expects it. Not appropriate for local services, health, legal, or finance.",
  },
};
const AXES = ["Hook", "Headline", "Image headline", "CTA", "Angle (big idea)"];

// Proof engine: 22 proof types across 5 categories, ranked by how hard each is to
// fake (harder to fake reads as stronger). Psychological types are flagged as
// underused, per the framework, not weak, just rarely reached for.
const PROOF_TYPES = [
  { id: "live-demo", category: "Experiential", name: "Live demo", desc: "Let them see or hear it working right now, on a real example.", strength: 5 },
  { id: "free-trial", category: "Experiential", name: "Free trial or sample", desc: "Let them experience the result themselves before paying.", strength: 4 },
  { id: "money-back", category: "Experiential", name: "Money-back guarantee", desc: "Risk reversal that proves you believe in the result.", strength: 4 },
  { id: "on-site-proof", category: "Experiential", name: "On-site or in-person proof", desc: "They can see it happening at their own location.", strength: 4 },
  { id: "interactive-tool", category: "Experiential", name: "Interactive calculator or tool", desc: "They plug in their own numbers and see their own proof.", strength: 4 },
  { id: "before-after", category: "Experiential", name: "Before-and-after", desc: "A visible change over time. Easy to cherry-pick, so it carries less weight than it looks like it should.", strength: 3 },
  { id: "case-study", category: "Empirical", name: "Case study with numbers", desc: "One specific, documented result with real figures.", strength: 4 },
  { id: "third-party-data", category: "Empirical", name: "Third-party study or data", desc: "A source outside the business backs the claim.", strength: 4 },
  { id: "track-record", category: "Empirical", name: "Track record or volume stats", desc: "Years in business, number served, aggregate outcomes.", strength: 3 },
  { id: "certification", category: "Credible", name: "Certification, license, or accreditation", desc: "A credential a regulator or board actually issues.", strength: 4 },
  { id: "partnership", category: "Credible", name: "Partnership or official affiliation", desc: "Manufacturer-authorized, insurance-approved, or similar.", strength: 4 },
  { id: "professional-credentials", category: "Credible", name: "Professional credentials of the person delivering it", desc: "Who is actually doing the work, and what they are qualified to do.", strength: 4 },
  { id: "awards", category: "Credible", name: "Awards or industry recognition", desc: "Third-party recognition, not a self-issued badge.", strength: 3 },
  { id: "media", category: "Credible", name: "Media mentions or press coverage", desc: "Independent coverage, not paid placement.", strength: 3 },
  { id: "testimonials", category: "Social", name: "Testimonials or reviews", desc: "Star ratings and quoted reviews. Common and easy to discount, pair with something harder to fake for a big claim.", strength: 2 },
  { id: "referral", category: "Social", name: "Referral or word-of-mouth signal", desc: "How new customers say they found you.", strength: 3 },
  { id: "community", category: "Social", name: "Visible community or user base", desc: "Active reviews, visible activity, a real audience.", strength: 3 },
  { id: "authority-transfer", category: "Psychological", name: "Authority transfer", desc: "An expert or credentialed figure vouches for it.", strength: 2, underused: true },
  { id: "social-consensus", category: "Psychological", name: "Social proof or consensus", desc: "Enough other people are already doing this that it feels safe.", strength: 1, underused: true },
  { id: "similarity-proof", category: "Psychological", name: "Similarity proof", desc: "Someone just like the reader got the result.", strength: 2, underused: true },
  { id: "founder-story", category: "Psychological", name: "Founder story or origin credibility", desc: "The person behind the offer has lived the problem firsthand.", strength: 2, underused: true },
  { id: "scarcity-signal", category: "Psychological", name: "Scarcity-backed proof", desc: "Limited availability that reflects real demand, not manufactured urgency.", strength: 1, underused: true },
];
// Curiosity Quadrant: two axes, market view vs your view, and problem vs solution.
// The "your view" cells are what actually create curiosity, since curiosity is the
// gap between what the market already believes and what you see instead.
const CURIOSITY_QUADRANTS = [
  { id: "market_problem", label: "What people already believe, about the problem" },
  { id: "market_solution", label: "What people already believe, about the solution" },
  { id: "your_problem", label: "What you see differently, about the problem" },
  { id: "your_solution", label: "What you see differently, about the solution" },
];
const CORPUS_CAP = 6000;
const HL_MAX = 30, DESC_MAX = 90, PATH_MAX = 15;

const SAMPLE = {
  offer: "The 3-Day AI Agency: a book and system that gets a complete beginner to a working, sellable AI service agency in three days, without coding or hiring.",
  audience: "Aspiring agency owners and side-hustlers, overwhelmed by AI, burned by courses that never ship.",
  struggle: "They have bought courses and watched endless tutorials but still have no working business.",
  dream: "A real, running agency they can sell to local businesses, up in days, not someday.",
  hesitation: "They think they are not technical enough, that it is too late, and that they have failed before.",
  proof: "A repeatable 3-day system, a published book, and a platform that runs the back end.",
  brandName: "Prompted Forge",
  domain: "promptedforge.ai",
  objective: "Lead generation",
  leadOffer: "Free 3-day quickstart guide",
  corpus:
`"I've spent like $4k on courses and I still don't have a single client. I just have folders of PDFs."
"Every guru says it's easy but nobody shows the boring middle part where you actually get a customer."
"I'm not a coder. The second they open a terminal I'm out."
"Honestly I'm 41 and I feel like I already missed the AI wave."
"I don't need more theory. I need someone to just tell me what to do in order."
"Refund. Another 'system' that was really just a Discord and some prompts."
"The only thing I want is one paying client so I can prove to my wife this isn't a scam."
"I get analysis paralysis. Too many tools, too many options, I freeze."
"3 day promise sounds like hype but if it's real that's exactly what I need."`,
};

const PRESETS = {
  "3-Day AI Agency (recruit operators)": { ...SAMPLE, voice: "Ambitious & direct" },
  "AI receptionist (local business)": {
    offer: "A 24/7 AI receptionist for local service businesses. It answers every call, texts back missed calls in seconds, and books appointments, so no lead slips away.",
    audience: "Local service business owners: dentists, contractors, salons, clinics, law offices. Busy, skeptical of tech, focused on revenue.",
    struggle: "The phone rings while they are with a customer. After-hours calls go to voicemail. The caller just dials the next business on the list.",
    dream: "Every call answered and every lead captured, even when they are busy, closed, or on a job.",
    hesitation: "They worry it will sound robotic and annoy their customers, that it is complicated to set up, and that it costs too much for a small shop.",
    proof: "A live demo on the owner's own number, response-time numbers, and local businesses already using it.",
    brandName: "Skyward Blue", domain: "skywardblue.com",
    objective: "Lead generation", leadOffer: "Free demo: hear it answer your own phone", voice: "Plain & credible", corpus: "",
  },
  "AI content (local business)": {
    offer: "Done-for-you AI content and follow-up for local businesses. Posts, review requests, and customer follow-ups handled every week, in the owner's own voice.",
    audience: "Local owners with no time or skill to market online, watching more visible competitors win.",
    struggle: "No time to post. Show up online once a month, then go quiet. Competitors look bigger and busier.",
    dream: "Show up everywhere, consistently, without doing the work or learning the tools.",
    hesitation: "They fear generic AI slop that does not sound like them, and another monthly bill with no clear return.",
    proof: "Sample content written in the owner's voice, and before-and-after of their online presence.",
    brandName: "Skyward Blue", domain: "skywardblue.com",
    objective: "Lead generation", leadOffer: "Free sample pack in your own voice", voice: "Plain & credible", corpus: "",
  },
  "Add AI to your business (general)": {
    offer: "Done-for-you AI setup for local businesses that know they need AI but have no idea where to start. We find the one or two highest-value uses and run them for you.",
    audience: "Overwhelmed local owners who hear about AI everywhere and do not know what is real or where to begin.",
    struggle: "AI is everywhere and none of it is clear. They are afraid of wasting money on the wrong tool and looking behind.",
    dream: "Practical AI working quietly in the business, saving time and money, without becoming a tech person.",
    hesitation: "Complexity, cost, and the fear that it is all hype.",
    proof: "A start-small pilot with one clear result, and local businesses they recognize.",
    brandName: "Skyward Blue", domain: "skywardblue.com",
    objective: "Lead generation", leadOffer: "Free AI opportunity audit for your business", voice: "Plain & credible", corpus: "",
  },
};

// callClaude (patched for our own backend)
// Posts to /api/generate instead of the Anthropic URL directly, and reads data.text.
// Because /api is served from the same Vercel project as the app, there is no CORS or key in the browser.
async function callClaude(prompt, maxTokens = 1500) {
  const TIMEOUT_MS = 70000; // stay above the server's 60s maxDuration so its own timeout, if any, surfaces first
  for (let attempt = 0; attempt < 2; attempt++) {
    let res;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, max_tokens: maxTokens }),
        signal: controller.signal,
      });
    } catch (netErr) {
      if (netErr.name === "AbortError") {
        if (attempt === 0) continue;
        throw new Error("Request timed out. The server took too long to respond. Try again.");
      }
      if (attempt === 0) { await new Promise((r) => setTimeout(r, 1200)); continue; }
      throw new Error("Network error. Check your connection and try again.");
    } finally {
      clearTimeout(timer);
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
function repairJSON(t) {
  let inStr = false, esc = false;
  const stack = [];
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === "\"") inStr = false;
      continue;
    }
    if (c === "\"") inStr = true;
    else if (c === "{" || c === "[") stack.push(c === "{" ? "}" : "]");
    else if (c === "}" || c === "]") { if (stack.length) stack.pop(); }
  }
  let out = t;
  if (inStr) out += "\"";
  out = out.replace(/,\s*$/, "");
  out = out.replace(/,?\s*"[^"]*"\s*:\s*$/, "");
  out = out.replace(/,\s*$/, "");
  for (let i = stack.length - 1; i >= 0; i--) out += stack[i];
  return out;
}
// Fixes mid-document JSON slips that repairJSON does not target (that one only
// closes off a truncated tail). The two common LLM failure modes here are a
// literal newline inside a string, and an unescaped quote inside a quoted
// phrase (easy to hit with verbatim customer quotes). This walks the text
// tracking whether we are inside a string, escapes stray control characters,
// and for a bare quote, looks ahead past whitespace: if the next real
// character is a valid JSON continuation (, } ] or :), it really ends the
// string; otherwise it is content and gets escaped instead.
function sanitizeJSONText(t) {
  let out = "";
  let inStr = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (!inStr) {
      out += c;
      if (c === "\"") inStr = true;
      continue;
    }
    if (c === "\\") {
      out += c;
      if (i + 1 < t.length) { out += t[i + 1]; i++; }
      continue;
    }
    if (c === "\n") { out += "\\n"; continue; }
    if (c === "\r") { continue; }
    if (c === "\t") { out += "\\t"; continue; }
    if (c === "\"") {
      let j = i + 1;
      while (j < t.length && /\s/.test(t[j])) j++;
      const next = t[j];
      const endsHere = next === undefined || next === "," || next === "}" || next === "]" || next === ":";
      if (endsHere) { out += c; inStr = false; }
      else { out += "\\\""; }
      continue;
    }
    out += c;
  }
  return out;
}
function parseJSON(text) {
  let t = (text || "").trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const s = t.indexOf("{");
  if (s !== -1) {
    const e = t.lastIndexOf("}");
    t = e > s ? t.slice(s, e + 1) : t.slice(s);
  }
  t = sanitizeJSONText(t);
  try { return JSON.parse(t); }
  catch (_) { return JSON.parse(repairJSON(t)); }
}
const stripQuoteMarks = (s) => String(s || "").replace(/^[\s"'“”‘’]+/, "").replace(/[\s"'“”‘’]+$/, "");
const wordCount = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
const initials = (s) => (s || "AD").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "AD";
const cv = (segs) => Math.round((segs.length / (segs.reduce((a, s) => a + wordCount(s.text), 0) || 1)) * 100);

const Dot = ({ name }) => <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: BLOCKS[name].color, marginRight: 6, verticalAlign: "middle" }} />;
const Spinner = () => <span className="cbae-spin" style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(0,0,0,.18)", borderTopColor: "#141414", borderRadius: "50%" }} />;
const CONF = { high: { t: "High confidence", c: "#1B7A43", bg: "#E1F1E7" }, medium: { t: "Medium confidence", c: "#9a7a0c", bg: "#F6F7DA" }, low: { t: "Inferred, low confidence", c: "#7A0E12", bg: "#FBE4E5" } };
const FREQ = { high: "#E8242B", medium: "#9a7a0c", low: "#9a9aa0" };
const Chip = ({ text, color }) => <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase", color, border: `1px solid ${color}`, borderRadius: 999, padding: "1px 7px", whiteSpace: "nowrap" }}>{text}</span>;

export default function App() {
  const [mode, setMode] = useState("guided");
  const [intake, setIntake] = useState({ core: "", niche: "", offer: "", audience: "", struggle: "", dream: "", hesitation: "", proof: "", corpus: "", brandName: "", domain: "", objective: "Lead generation", leadOffer: "", voice: "Plain & credible", regulated: false });
  const [platform, setPlatform] = useState("Facebook");
  const [complianceAck, setComplianceAck] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarStage, setAvatarStage] = useState("");
  const [blocks, setBlocks] = useState({ Pain: "", Promise: "", Proof: "", Constraints: "", Curiosity: "", Conditions: "" });
  const [notes, setNotes] = useState({});
  const [proofPairing, setProofPairing] = useState([]);
  const [constraintDissolve, setConstraintDissolve] = useState([]);
  const [curiosityAngles, setCuriosityAngles] = useState([]);
  const [characterizations, setCharacterizations] = useState([]);
  const [templateId, setTemplateId] = useState("auto");
  const [recommended, setRecommended] = useState(null);
  const [testAxis, setTestAxis] = useState("Hook");
  const [testCount, setTestCount] = useState(3);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [offers, setOffers] = useState([]);
  const [chosenOffer, setChosenOffer] = useState("");
  const [frontMode, setFrontMode] = useState("brainstorm");
  const [manualOffer, setManualOffer] = useState("");
  const [offerSteer, setOfferSteer] = useState("");
  const [showRef, setShowRef] = useState(false);
  const resultsRef = useRef(null);
  const avatarRef = useRef(null);
  const [done, setDone] = useState("");

  const setIn = (k, v) => setIntake((s) => ({ ...s, [k]: v }));
  const markDone = (k) => { setDone(k); setTimeout(() => setDone((d) => (d === k ? "" : d)), 1800); };
  const setBlock = (k, v) => setBlocks((b) => ({ ...b, [k]: v }));
  const loadPreset = (k) => PRESETS[k] && setIntake((s) => ({ ...s, ...PRESETS[k] }));
  const hasCorpus = intake.corpus.trim().length > 0;
  const corpusTrimmed = intake.corpus.length > CORPUS_CAP;
  const isLeadGen = intake.objective === "Lead generation";
  const isSearch = platform === "Google Search";
  const brand = intake.brandName || "Your Brand";
  const domain = (intake.domain || "yourbrand.com").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const ctaList = isLeadGen ? LEADGEN_CTAS : SALES_CTAS;

  const activeTemplate = useMemo(() => {
    if (templateId === "auto") return recommended ? TEMPLATES.find((t) => t.id === recommended.id) : null;
    return TEMPLATES.find((t) => t.id === Number(templateId));
  }, [templateId, recommended]);

  const blockText = () => Object.values(blocks).some((v) => v.trim()) ? BLOCK_NAMES.map((n) => `${n}: ${blocks[n] || "(infer)"}`).join("\n") : "(infer from offer and avatar)";
  const placementLine = (p) => FEED.includes(p) ? `This is a ${p} feed ad. Shape it to the real fields.` : `This is a ${p} video ad; primaryText is the on-screen script and the first segment is the on-screen hook.`;
  const voiceLine = () => (VOICES[intake.voice] || VOICES["Plain & credible"]).rule;
  const complianceLine = () => intake.regulated
    ? "\nCOMPLIANCE: This is a regulated vertical (health, legal, or finance). Make no medical, legal, financial, or income claims. No cures, no outcome guarantees, no before-and-after health imagery. State only what can be substantiated. Sell the free next step, not the result. Keep curiosity credible, with no taboo or shock framing. All output will be human-reviewed before spend."
    : "";
  const objectiveLine = () => (isLeadGen
    ? `OBJECTIVE: lead generation. The ad sells the NEXT STEP, not the purchase. The CTA and the Conditions block must offer the lead magnet: ${intake.leadOffer || "a free consult / inspection / quote"}. Do not try to close the sale inside the ad.`
    : `OBJECTIVE: direct sale. Drive the purchase with the CTA.`) + "\n" + voiceLine() + complianceLine();

  async function buildAvatar() {
    setError("");
    if (!intake.offer.trim()) { setError("Add what you sell first. The rest is optional."); return; }
    setBusy("avatar");
    try {
      const corpus = intake.corpus.slice(0, CORPUS_CAP);
      const context = `WHAT THEY SELL: ${intake.offer}
WHO IT IS FOR: ${intake.audience || "(infer)"}
STRUGGLE: ${intake.struggle || "(infer)"}
DREAM: ${intake.dream || "(infer)"}
HESITATION: ${intake.hesitation || "(infer)"}
PROOF THEY HAVE: ${intake.proof || "(infer / note if thin)"}`;

      // Call 1: research pass. Its only job is to extract and structure raw findings,
      // so it gets its own token budget instead of sharing one call with the synthesis below.
      const researchTask = hasCorpus
        ? `RAW MARKET LANGUAGE the seller pasted:
"""
${corpus}
"""
RUN A RESEARCH PASS: extract statements and tag them (pain, desire, belief, objection, demanded-proof, existing-angle, quote); cluster and rank by frequency and emotional charge; classify pains (physiological, psychological, social stigma, measurable); flag angles already present and their saturation; attach a short verbatim quote (20 words max) to each pain when one exists, never invent quotes. Ground every field in the corpus. Confidence high if strongly supported, medium if partial, low if mostly inferred.`
        : `No market language was pasted. Build this research from general knowledge of this exact market and from the answers given. Ground every field in what is common and widely shared among this audience, the pains, desires, and prior solutions that most members of this market actually have. Be specific to this vertical, not generic. Use "" for quotes since none were provided, and never invent quotes. Set confidence by how well understood this market is: use "medium" for a common, well documented vertical, "low" only when it is narrow, niche, or mostly a guess. Never use "high" without pasted market language. In coverageNote, say this is built from general market knowledge and name the basis for the confidence level.`;
      const researchPrompt =
`You are a market research analyst doing an extraction pass, not writing the final avatar yet.
${context}
${voiceLine()}${complianceLine()}

${researchTask}

Be thorough, you have room here. Use up to 5 items per array where you have real, specific material, fewer if you would be padding. Return ONLY valid JSON, no fences: escape any quote marks inside a string as \", and never put a literal line break inside a string value.
{"confidence":"high|medium|low","coverageNote":"","painPoints":[{"text":"","type":"psychological|physiological|social|measurable","frequency":"high|medium|low","quote":"<=20 words or empty, the words only, no surrounding quote marks"}],"relationalImpact":[""],"desiredOutcomes":[""],"coreWound":"","fears":[""],"beliefs":[""],"constraints":{"Money":"","Time":"","Effort":""},"objections":[""],"priorSolutions":[{"tried":"","whyFailed":""}],"wontDo":[""],"villain":"","secondaryGain":"","proofTrusted":[""],"proofGaps":[""],"marketAngles":[{"angle":"","saturation":"high|medium|low"}],"voiceSamples":[""]}`;
      setAvatarStage("research");
      const researchOut = await callClaude(researchPrompt);
      const research = parseJSON(researchOut);

      // Call 2: synthesis. Takes the structured research as input and writes the final
      // avatar in the schema the rest of the app reads, with real room to go deeper
      // than the old single-call version could afford.
      const synthesisPrompt =
`You are a market research strategist building a buyer avatar in the Anvil tradition, from this structured research pass:
RESEARCH: ${JSON.stringify(research)}

${context}
${voiceLine()}${complianceLine()}

Reframe every field for THIS market, not generic infomarketing. The villain is a market force or system, never a person the reader loves. Relational impact means staff, partners, family in the business, reputation, and customers, framed honestly, not cruelly. No vanity or shock framing.

You have real room here: up to 4 items per array, and a phrase can run a full sentence when it earns its place. Do not pad or invent to fill space. Return ONLY valid JSON, no fences: escape any quote marks inside a string as \", and never put a literal line break inside a string value.
{"confidence":"high|medium|low","coverage":"one line on corpus vs inference","pains":[{"text":"","type":"psychological|physiological|social|measurable","frequency":"high|medium|low","quote":"<=20 words or empty, the words only, no surrounding quote marks"}],"relationalImpact":["how the problem shows up with staff, family, reputation, or customers"],"desire":"the promised land in one line","dreamOutcomes":["concrete, specific outcomes if it were fully solved"],"coreWound":"","fears":["deep, mostly unspoken fears"],"beliefs":[""],"constraints":{"Money":"","Time":"","Effort":""},"objections":[""],"triedBefore":[{"tried":"a prior solution they tried","whyFailed":"why it let them down"}],"wontDo":["what they refuse to do to fix it"],"villain":"the outside force they blame, a market force or system, not a person","secondaryGain":"what they quietly lose or give up by solving it","proofTrusted":[""],"proofGaps":[""],"marketAngles":[{"angle":"","saturation":"high|medium|low"}],"voice":[""]}`;
      setAvatarStage("build");
      const out = await callClaude(synthesisPrompt, 2400);
      setAvatar(parseJSON(out)); markDone("avatar"); scrollAvatar();
    } catch (e) { setError("Could not build the avatar. " + ((e && e.message) || "Unknown error") + ". Try again, or switch to Expert mode to skip the avatar."); }
    finally { setBusy(""); setAvatarStage(""); }
  }

  async function buildBlocks() {
    setError("");
    if (!avatar) { setError("Build the avatar first."); return; }
    setBusy("blocks");
    try {
      const prompt =
`Turn this researched avatar into the six blocks for the offer.
OFFER: ${intake.offer}
${objectiveLine()}
AVATAR: ${JSON.stringify(avatar)}
Per block, 1 to 3 sentences in the market's own language:
- Pain: a layered pain (general -> specific -> in their life -> deep emotion); lean on high-frequency pains, the relationalImpact, and real quotes. Where it fits, name the villain so the pain is not the reader's fault.
- Promise: a promise ladder toward the desire and the dreamOutcomes, framed as the result WITHOUT the things in wontDo.
- Proof: use ONLY proofTrusted; soften where proofGaps exist, never fabricate.
- Constraints: name the biggest blocking belief/objection, then dissolve or sidestep it by acknowledging it, wedging in a counterexample, then reframing. Use secondaryGain and wontDo to address the objection under the objection.
- Curiosity: a fresh insight near the insight level; AVOID high-saturation angles; make it clearly different from what they triedBefore so it does not sound like the things that already failed them; name a mechanism if you can.
- Conditions: one CTA wrapper that matches the objective.
Return ONLY JSON, no fences:
{"Pain":"","Promise":"","Proof":"","Constraints":"","Curiosity":"","Conditions":"","notes":{"Pain":"","Promise":"","Proof":"","Constraints":"","Curiosity":"","Conditions":""}}`;
      const out = await callClaude(prompt);
      const j = parseJSON(out);
      setBlocks({ Pain: j.Pain || "", Promise: j.Promise || "", Proof: j.Proof || "", Constraints: j.Constraints || "", Curiosity: j.Curiosity || "", Conditions: j.Conditions || "" });
      setNotes(j.notes || {});
      markDone("blocks");
    } catch (e) { setError("Could not build the blocks. " + ((e && e.message) || "Unknown error") + ". Try again."); }
    finally { setBusy(""); }
  }

  async function draftBlocksExpert() {
    setError("");
    if (!intake.offer.trim()) { setError("Add what you sell first."); return; }
    setBusy("blocks");
    try {
      const prompt =
`Write the six blocks for this offer in the market's language, each 1 to 3 sentences.
OFFER: ${intake.offer}
MARKET: ${intake.audience || "infer"}
${objectiveLine()}
Blocks: Pain, Promise, Proof, Constraints, Curiosity (name a mechanism), Conditions (a CTA wrapper matching the objective).
Return ONLY JSON: {"Pain":"","Promise":"","Proof":"","Constraints":"","Curiosity":"","Conditions":""}`;
      const out = await callClaude(prompt);
      const j = parseJSON(out);
      setBlocks({ Pain: j.Pain || "", Promise: j.Promise || "", Proof: j.Proof || "", Constraints: j.Constraints || "", Curiosity: j.Curiosity || "", Conditions: j.Conditions || "" });
      markDone("blocks");
    } catch (e) { setError("Could not draft. " + ((e && e.message) || "Unknown error") + ". Fill the blocks by hand or try again."); }
    finally { setBusy(""); }
  }

  async function buildProofPairing() {
    setError("");
    const dreamOutcomes = avatar && Array.isArray(avatar.dreamOutcomes) ? avatar.dreamOutcomes.join(" | ") : "";
    if (!blocks.Promise.trim() && !dreamOutcomes && !intake.dream.trim()) { setError("Fill in the Promise block, or the dream field, first. Proof needs a claim to back."); return; }
    setBusy("proof");
    try {
      const claimsContext = `PROMISE BLOCK: ${blocks.Promise || "(not filled)"}
DREAM OUTCOME(S): ${dreamOutcomes || intake.dream || "(infer)"}`;
      const proofOnHand = avatar
        ? `PROOF THE MARKET TRUSTS (you have): ${JSON.stringify(avatar.proofTrusted || [])}
PROOF GAPS: ${JSON.stringify(avatar.proofGaps || [])}`
        : `PROOF THEY HAVE: ${intake.proof || "(thin or unspecified)"}`;
      const typesList = PROOF_TYPES.map((p) => `${p.id}: ${p.name} [${p.category}, hard-to-fake ${p.strength}/5${p.underused ? ", underused" : ""}] - ${p.desc}`).join("\n");
      const prompt =
`You are a direct-response strategist pairing proof to claims, in the Anvil framework.
OFFER: ${intake.offer}
${claimsContext}
${proofOnHand}
${voiceLine()}${complianceLine()}

Identify 2 to 4 specific claims or promises being made, pulled from the Promise block and dream outcomes above, do not invent new claims. For each claim, pick the single best-fitting proof type from this closed list, using the id exactly as written:
${typesList}

Rules: match proof strength to the size of the claim; a bold or specific promise needs a harder-to-fake proof type when one is available, a modest claim can use a lighter one. Only draft proofText from what is actually in the proof on hand above, never invent a testimonial, a number, or a credential that was not given. If nothing on hand actually backs a claim, set gap to true and leave proofText thin or empty rather than making something up. Prefer psychological proof types when they genuinely fit, since this category is underused, but never force one.

Return ONLY valid JSON, no fences: escape any quote marks inside a string as \", and never put a literal line break inside a string value.
{"pairings":[{"claim":"the specific claim or promise","proofTypeId":"one of the ids above","proofText":"one sentence using only real material on hand, or empty if gap is true","gap":false}]}`;
      const out = await callClaude(prompt, 1800);
      const j = parseJSON(out);
      setProofPairing(Array.isArray(j.pairings) ? j.pairings.slice(0, 4) : []);
      markDone("proof");
    } catch (e) { setError("Could not build proof pairing. " + ((e && e.message) || "Unknown error") + ". Try again, or fill the Proof block by hand."); }
    finally { setBusy(""); }
  }

  async function buildConstraintsDissolve() {
    setError("");
    const hasMaterial = (avatar && (avatar.objections || avatar.beliefs)) || intake.hesitation.trim();
    if (!hasMaterial) { setError("Add a hesitation or build the avatar first. Dissolving a constraint needs a real objection to work from."); return; }
    setBusy("constraints");
    try {
      const material = avatar
        ? `OBJECTIONS: ${JSON.stringify(avatar.objections || [])}
BELIEFS: ${JSON.stringify(avatar.beliefs || [])}
TRIED BEFORE (and why it failed): ${JSON.stringify(avatar.triedBefore || [])}
THE 3 CONSTRAINTS: ${JSON.stringify(avatar.constraints || {})}`
        : `HESITATION: ${intake.hesitation || "(infer)"}`;
      const prompt =
`You are a persuasion strategist dissolving objections, in the Anvil framework.
OFFER: ${intake.offer}
${material}
${voiceLine()}${complianceLine()}

For 2 to 4 real objections or beliefs above, do not invent new ones, classify each on this hierarchy:
- Experience: a specific bad experience or a missing fact. Dissolve it directly.
- Belief: a generalized rule they have concluded from experience. Dissolve it with an acknowledge, a wedge, and an elaboration.
- Value: something they hold as personally important, not just a factual belief. Never argue with it, side-step by showing the offer serves the value instead of fighting it.
- Identity: tied to who they are or how they see themselves. Never challenge it directly, side-step by framing the offer as consistent with that identity, not a threat to it.

For an Experience or Belief level objection, write a dissolve in three short parts: acknowledge the objection as reasonable, wedge in a distinction or a real counterexample showing it does not universally apply, then elaborate on why that changes things for this specific offer. For a Value or Identity level objection, write a single sidestep line that reframes the offer as compatible with what they value or who they are. It must never read as a rebuttal or as arguing with the person.

Return ONLY valid JSON, no fences: escape any quote marks inside a string as \", and never put a literal line break inside a string value.
{"constraints":[{"objection":"the real objection or belief, in their words","level":"Experience|Belief|Value|Identity","strategy":"dissolve|sidestep","acknowledge":"","wedge":"","elaborate":"","sidestep":""}]}`;
      const out = await callClaude(prompt, 1800);
      const j = parseJSON(out);
      setConstraintDissolve(Array.isArray(j.constraints) ? j.constraints.slice(0, 4) : []);
      markDone("constraints");
    } catch (e) { setError("Could not build the dissolve. " + ((e && e.message) || "Unknown error") + ". Try again, or fill the Constraints block by hand."); }
    finally { setBusy(""); }
  }

  async function buildCuriosityAngles() {
    setError("");
    const hasMaterial = (avatar && (avatar.marketAngles || avatar.pains || avatar.dreamOutcomes)) || blocks.Pain.trim() || blocks.Promise.trim() || intake.struggle.trim() || intake.dream.trim();
    if (!hasMaterial) { setError("Fill in Pain or Promise, or the struggle and dream fields, or build the avatar first. Curiosity needs a real pain and promise to find the gap between."); return; }
    setBusy("curiosity");
    try {
      const material = avatar
        ? `MARKET ANGLES ALREADY IN USE (avoid these, they are saturated): ${JSON.stringify(avatar.marketAngles || [])}
WHAT THEY HAVE TRIED BEFORE (and why it failed): ${JSON.stringify(avatar.triedBefore || [])}
PAINS: ${JSON.stringify(avatar.pains || [])}
DREAM OUTCOMES: ${JSON.stringify(avatar.dreamOutcomes || [])}`
        : `PAIN: ${blocks.Pain || intake.struggle || "(infer)"}
PROMISE: ${blocks.Promise || intake.dream || "(infer)"}`;
      const quadrantList = CURIOSITY_QUADRANTS.map((q) => `${q.id}: ${q.label}`).join("\n");
      const prompt =
`You are a direct-response strategist finding curiosity angles, in the Anvil framework.
OFFER: ${intake.offer}
${material}
${voiceLine()}${complianceLine()}

Curiosity lives in the gap between what the market already believes and what you actually see. For each of these 4 fixed quadrants, using the id exactly as written, write one short angle:
${quadrantList}

The two "what people already believe" quadrants should sound like the common, saturated take, the thing every competitor already says. The two "what you see differently" quadrants are the actual differentiator, write a genuinely different, specific angle, not a rephrase of the common one, grounded in the pain and promise above, not invented from nothing. Avoid any angle that resembles what they have tried before or what is already saturated in the market angles list. Do not use a Taboo Solution frame, a shock or taboo characterization, or an idea caricature, in any quadrant, regardless of voice. Keep every angle something you could say to this client's face without flinching.

Also name up to 2 characterizations: a plain, specific name for a mechanism or step in how the offer works, the kind of naming that makes a process feel concrete and ownable. Example of the right register: "same-day roof report," not a gimmick name and not a hype name.

Return ONLY valid JSON, no fences: escape any quote marks inside a string as \", and never put a literal line break inside a string value.
{"angles":[{"quadrantId":"one of the 4 ids above","angle":"the angle, one to two sentences"}],"characterizations":[{"name":"the short name","description":"one sentence on what it names and why it fits"}]}`;
      const out = await callClaude(prompt, 1800);
      const j = parseJSON(out);
      setCuriosityAngles(Array.isArray(j.angles) ? j.angles.slice(0, 4) : []);
      setCharacterizations(Array.isArray(j.characterizations) ? j.characterizations.slice(0, 2) : []);
      markDone("curiosity");
    } catch (e) { setError("Could not build curiosity angles. " + ((e && e.message) || "Unknown error") + ". Try again, or fill the Curiosity block by hand."); }
    finally { setBusy(""); }
  }

  async function recommendTemplate() {
    setError("");
    if (!intake.offer.trim()) { setError("Add what you sell so the engine can match a template."); return; }
    setBusy("recommend");
    try {
      const list = TEMPLATES.map((t) => `${t.id}. ${t.name} - ${t.when}`).join("\n");
      const prompt = `Pick the single best ad template for this offer.\nOFFER: ${intake.offer}\nMARKET: ${intake.audience || "infer"}\n${blocks.Curiosity ? "ANGLE: " + blocks.Curiosity : ""}\nTEMPLATES:\n${list}\n${voiceLine()}\nReturn ONLY JSON: {"id": <number>, "reason": "<one sentence>"}`;
      const out = await callClaude(prompt);
      const j = parseJSON(out);
      setRecommended({ id: j.id, reason: j.reason });
      setTemplateId("auto");
      markDone("recommend");
    } catch (e) { setError("Could not recommend. " + ((e && e.message) || "Unknown error") + ". Pick a template from the menu."); }
    finally { setBusy(""); }
  }

  async function generateOffers(steer) {
    setError("");
    if (!intake.core.trim()) { setError("Add your core offer first."); return; }
    setBusy("offers");
    try {
      const steerLine = steer && steer.trim()
        ? `\nWHAT THE USER HAS IN MIND / WANTS ADJUSTED: ${steer.trim()}\nHonor this. If it is a specific idea, make a sharpened version of it the first option, then add complementary alternatives. If it is an adjustment, move the whole set in that direction.`
        : "";
      const prompt =
`You are a direct-response offer strategist. Generate 6 distinct front-door (foot-in-the-door) offers that get a stranger in this niche to say yes to a first small step, which then leads to the core paid offer.
CORE PAID OFFER: ${intake.core}
NICHE: ${intake.niche || "(infer a sensible target)"}
${voiceLine()}${steerLine}

Spread across DIFFERENT archetypes, do not repeat one. Draw from: free audit or assessment, free sample or trial, free training / workshop / mini-course, free tool / template / checklist, teardown or review of their current setup, scorecard or quiz, low-cost tripwire. Each offer must be specific to this niche and this core. Prefer low-friction, credible offers, and avoid hypey free-money framing for trust-heavy or regulated niches.

Return ONLY JSON, no fences:
{"offers":[{"name":"the offer, specific and concrete","type":"the archetype","why":"why it fits this niche, one line","bridge":"how it naturally leads to the core paid offer, one line","friction":"low|medium|high"}]}`;
      const out = await callClaude(prompt);
      const j = parseJSON(out);
      setOffers(Array.isArray(j.offers) ? j.offers.slice(0, 6) : []);
      markDone("offers");
    } catch (e) { setError("Could not generate offers. " + ((e && e.message) || "Unknown error") + ". Try again."); }
    finally { setBusy(""); }
  }

  function useManualOffer() {
    if (!manualOffer.trim()) { setError("Type your front-door offer first."); return; }
    useOffer({ name: manualOffer.trim(), type: "your own offer" });
  }

  function useOffer(o) {
    setIntake((s) => ({ ...s, offer: o.name, audience: s.audience || s.niche, leadOffer: o.name, objective: "Lead generation" }));
    setChosenOffer(o.name);
    setAvatar(null);
    setBlocks({ Pain: "", Promise: "", Proof: "", Constraints: "", Curiosity: "", Conditions: "" });
    setNotes({});
    setRecommended(null);
    setTemplateId("auto");
  }

  function makeAd(j, extra) {
    const segs = Array.isArray(j.primaryText) ? j.primaryText.filter((s) => s && s.text) : [];
    return {
      kind: "ad", platform, brand, domain, objective: intake.objective, template: activeTemplate,
      primaryText: segs, headline: j.headline || "", description: j.description || "",
      cta: CTA_OPTIONS.includes(j.cta) ? j.cta : ctaList[0], imageHeadline: j.imageHeadline || "", imageSubline: j.imageSubline || "",
      craves: j.craves || {}, hooks: Array.isArray(j.hooks) ? j.hooks.slice(0, 3) : [], creativeBrief: j.creativeBrief || "",
      copyVelocity: cv(segs), words: segs.reduce((a, s) => a + wordCount(s.text), 0),
      ...extra,
    };
  }
  const scrollResults = () => setTimeout(() => resultsRef.current && resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  const scrollAvatar = () => setTimeout(() => avatarRef.current && avatarRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 90);

  async function generateAd() {
    setError("");
    if (!intake.offer.trim()) { setError("Add what you sell to generate an ad."); return; }
    if (intake.regulated && !complianceAck) { setError("This is marked a regulated vertical. Acknowledge the compliance step in settings before generating."); return; }
    if (isSearch) return generateRSA();
    const tpl = activeTemplate;
    if (!tpl) { setError("Pick a template, or hit Recommend."); return; }
    setBusy("generate");
    try {
      const prompt =
`You are an elite direct-response copywriter producing a ${platform} ad in the Anvil framework, shaped to the platform's fields.
OFFER: ${intake.offer}
MARKET: ${intake.audience || "infer"}
${objectiveLine()}
${avatar ? "AVATAR: " + JSON.stringify(avatar) : ""}
COPY BLOCKS:
${blockText()}
TEMPLATE: ${tpl.name}
STRUCTURE: Opening = ${tpl.opening}; Middle = ${tpl.middle}; Close = ${tpl.close}

${placementLine(platform)}

Output rules:
- primaryText: ordered segments, each carrying ONE block. The FIRST segment MUST be the Curiosity hook, a complete thought under 120 characters, because it is all that shows before the fold. Then template order with Pain, Constraints, Promise, Proof.
- headline: 40 chars max, crystallize the Promise.
- description: 30 chars max.
- cta: choose ONE exactly from: ${ctaList.join(", ")}.
- imageHeadline: 7 words max. imageSubline: 8 words max.
Apply Polish and use the customer's real voice. Clarity comes first. Use only the blocks that earn their place; never pad or cram to inflate the count. Avoid high-saturation angles.

Return ONLY JSON, no fences:
{"primaryText":[{"block":"Curiosity","text":"..."}],"headline":"","description":"","cta":"${ctaList[0]}","imageHeadline":"","imageSubline":"","craves":{"Clear":4,"Relevant":5,"Accurate":4,"Visual":5,"Expressive":4,"Specific":5},"hooks":["","",""],"creativeBrief":""}
craves 1-5. Exactly 3 hooks.`;
      const out = await callClaude(prompt);
      setResults((r) => [{ id: Date.now(), ...makeAd(parseJSON(out)) }, ...r]);
      markDone("generate"); scrollResults();
    } catch (e) { setError("Generation failed. " + ((e && e.message) || "Came back malformed") + ". Try again."); }
    finally { setBusy(""); }
  }

  async function generateRSA() {
    setError("");
    if (!intake.offer.trim()) { setError("Add what you sell to generate search ads."); return; }
    if (intake.regulated && !complianceAck) { setError("This is marked a regulated vertical. Acknowledge the compliance step in settings before generating."); return; }
    setBusy("generate");
    try {
      const prompt =
`You are writing a Google Responsive Search Ad in the Anvil framework.
OFFER: ${intake.offer}
MARKET: ${intake.audience || "infer"}
BRAND: ${brand}
${objectiveLine()}
${avatar ? "AVATAR: " + JSON.stringify(avatar) : ""}
COPY BLOCKS:
${blockText()}

Produce a complete asset set Google can mix and match:
- 15 distinct headlines, each ${HL_MAX} characters or fewer. Spread across themes: Curiosity hooks, Promise/benefit, Proof/credibility, the offer/CTA (Conditions), and keyword-forward headlines that name the service or brand. At least 4 headlines must contain the main service keyword. Each headline stands alone.
- 4 descriptions, each ${DESC_MAX} characters or fewer, blending Promise, Proof, and a CTA. For lead generation the CTA is the free ${intake.leadOffer || "consult / inspection / quote"}.
- 2 display paths, each ${PATH_MAX} characters or fewer.
Respect every character limit. Return ONLY JSON, no fences:
{"headlines":["",""],"descriptions":["","","",""],"paths":["",""]}`;
      const out = await callClaude(prompt);
      const j = parseJSON(out);
      setResults((r) => [{
        kind: "rsa", id: Date.now(), platform: "Google Search", brand, domain, objective: intake.objective,
        headlines: (Array.isArray(j.headlines) ? j.headlines : []).filter(Boolean).slice(0, 15),
        descriptions: (Array.isArray(j.descriptions) ? j.descriptions : []).filter(Boolean).slice(0, 4),
        paths: (Array.isArray(j.paths) ? j.paths : []).filter(Boolean).slice(0, 2),
      }, ...r]);
      markDone("generate"); scrollResults();
    } catch (e) { setError("Could not build the search ads. " + ((e && e.message) || "Unknown error") + ". Try again."); }
    finally { setBusy(""); }
  }

  async function generateTestSet() {
    setError("");
    if (!intake.offer.trim()) { setError("Add what you sell to run a test."); return; }
    if (intake.regulated && !complianceAck) { setError("This is marked a regulated vertical. Acknowledge the compliance step in settings before generating."); return; }
    if (isSearch) { setError("For Google Search, generate the asset set. Google rotates the headlines and descriptions for you. Use the A/B lab on a feed or video placement."); return; }
    const tpl = activeTemplate;
    if (!tpl) { setError("Pick a template, or hit Recommend."); return; }
    setBusy("test");
    try {
      const axis = testAxis, n = testCount;
      const rule = {
        "Hook": "Only the opening hook (the first Curiosity segment) may differ between variants. Make each hook a distinctly different angle. EVERY other field must be identical across all variants.",
        "Headline": "Only the headline may differ (40 chars max each). EVERY other field identical across variants.",
        "Image headline": "Only imageHeadline and imageSubline may differ. EVERY other field identical across variants.",
        "CTA": `Only the cta may differ; each must be exactly one of: ${ctaList.join(", ")}. EVERY other field identical across variants.`,
        "Angle (big idea)": "Each variant tests a DIFFERENT big idea using a different angle grid cell (market problem, market solution, your problem, your solution). The whole ad changes to fit the angle.",
      }[axis];
      const prompt =
`You are running a single-variable A/B test of ${n} ad variants for a ${platform} ad in the Anvil framework.
OFFER: ${intake.offer}
MARKET: ${intake.audience || "infer"}
${objectiveLine()}
${avatar ? "AVATAR: " + JSON.stringify(avatar) : ""}
COPY BLOCKS:
${blockText()}
TEMPLATE: ${tpl.name} (Opening ${tpl.opening}; Middle ${tpl.middle}; Close ${tpl.close})

TEST VARIABLE: ${axis}.
${rule}
Variant A is the control. Give each variant a short note on what makes it different.
Each variant is a full ad. primaryText first segment is the Curiosity hook under 120 chars. cta must be from the allowed list. Keep copy tight.

Return ONLY JSON, no fences:
{"variable":"${axis}","hypothesis":"one line: what we expect to learn","metric":"the first number to watch","nextTest":"what to test after a winner","variants":[{"label":"A","note":"","primaryText":[{"block":"Curiosity","text":""}],"headline":"","description":"","cta":"${ctaList[0]}","imageHeadline":"","imageSubline":""}]}`;
      const out = await callClaude(prompt);
      const j = parseJSON(out);
      const variants = (Array.isArray(j.variants) ? j.variants : []).map((v, i) => ({
        id: Date.now() + i + 1, ...makeAd(v, { label: v.label || String.fromCharCode(65 + i), note: v.note || "", isControl: i === 0 }),
      }));
      setResults((r) => [{ kind: "test", id: Date.now(), platform, variable: j.variable || axis, hypothesis: j.hypothesis || "", metric: j.metric || "", nextTest: j.nextTest || "", variants }, ...r]);
      markDone("test"); scrollResults();
    } catch (e) { setError("Could not build the test set. " + ((e && e.message) || "Unknown error") + ". Try fewer variants, or try again."); }
    finally { setBusy(""); }
  }

  const label = { fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#6b6b70", marginBottom: 6, display: "block" };
  const field = { width: "100%", boxSizing: "border-box", border: "1px solid #e2e2e6", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", color: "#141414", outline: "none", background: "#fff" };
  const btn = { fontFamily: "inherit", fontWeight: 700, fontSize: 13, borderRadius: 8, padding: "10px 14px", cursor: "pointer", border: "1px solid #141414", background: "#141414", color: "#fff", display: "inline-flex", alignItems: "center", gap: 8 };
  const btnGhost = { ...btn, background: "#fff", color: "#141414" };
  const btnWork = { background: "#9a7a0c", border: "1px solid #9a7a0c", color: "#fff" };
  const btnDone = { background: "#1B7A43", border: "1px solid #1B7A43", color: "#fff" };
  const btnState = (key, base) => busy === key ? { ...base, ...btnWork } : done === key ? { ...base, ...btnDone } : base;
  const card = { background: "#fff", border: "1px solid #ececef", borderRadius: 14, padding: 18 };
  const step = (n) => <span style={{ display: "inline-flex", width: 20, height: 20, borderRadius: "50%", background: "#141414", color: "#fff", fontSize: 11, fontWeight: 800, alignItems: "center", justifyContent: "center", marginRight: 8 }}>{n}</span>;

  const intakeFields = [
    { k: "offer", q: "What is this ad promoting?", ph: "The offer this specific ad sells. If you used Step 0, this is your front-door offer, which leads to your core. Otherwise, just what you sell.", req: true, min: 64 },
    { k: "audience", q: "Who is it for?", ph: "Leave blank to let the engine infer.", min: 48 },
    { k: "struggle", q: "What do customers struggle with before they find you?", ph: "What they complain about. Optional.", min: 48 },
    { k: "dream", q: "What do they wish were true?", ph: "The result they are chasing. Optional.", min: 48 },
    { k: "hesitation", q: "What makes people hesitate to buy?", ph: "Doubts and objections. Optional.", min: 48 },
    { k: "proof", q: "What proof do you have?", ph: "Results, testimonials, credentials, data, guarantees. Optional.", min: 48 },
  ];
  const conf = avatar && CONF[avatar.confidence] ? CONF[avatar.confidence] : CONF.low;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#141414", background: "#f6f6f7", minHeight: "100vh", padding: "0 0 64px" }}>
      <style>{`
        @keyframes cbae-spin { to { transform: rotate(360deg) } }
        .cbae-spin { animation: cbae-spin .7s linear infinite }
        *:focus-visible { outline: 2px solid #141414; outline-offset: 2px }
        @media (prefers-reduced-motion: reduce){ .cbae-spin{ animation:none } *{ scroll-behavior:auto !important } }
        .cbae-grid { display:grid; grid-template-columns: 1fr; gap:20px }
        @media (min-width: 920px){ .cbae-grid { grid-template-columns: 400px 1fr } }
        textarea { resize: vertical }
      `}</style>

      <header style={{ background: "#141414", color: "#fff", padding: "26px 22px 30px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>{BLOCK_NAMES.map((n) => <span key={n} title={n} style={{ width: 26, height: 6, borderRadius: 2, background: BLOCKS[n].color }} />)}</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: "#9a9aa0" }}>Prompted Forge</div>
          <h1 style={{ margin: "4px 0 0", fontSize: 38, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.02 }}>Anvil</h1>
          <p style={{ margin: "10px 0 0", maxWidth: 700, color: "#c9c9ce", fontSize: 14.5, lineHeight: 1.5 }}>
            From your offer to finished ads, A/B test sets, or a full search ad asset set, tuned to your objective and voice, previewed per placement. Built for Meta, TikTok, YouTube Shorts, and Google Search.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 22px 0" }}>
        <div className="cbae-grid">
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <section style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{step(0)}Find the offer</h2>
                <span style={{ fontSize: 11, color: "#9a9aa0" }}>optional</span>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#6b6b70", lineHeight: 1.5 }}>Two different things live here. Your <strong>core offer</strong> is the paid thing you ultimately sell. The <strong>front-door offer</strong> is the free first step that gets a stranger to say yes and leads to the core. Set the core, then land the front-door offer below.</p>
              <label style={label}>Your core offer (the paid thing you ultimately sell)</label>
              <textarea style={{ ...field, minHeight: 52 }} value={intake.core} onChange={(e) => setIn("core", e.target.value)} placeholder="e.g. Done-for-you content creation" />
              <div style={{ height: 10 }} />
              <label style={label}>Target niche</label>
              <input style={field} value={intake.niche} onChange={(e) => setIn("niche", e.target.value)} placeholder="e.g. Real estate companies and agents" />

              <div style={{ height: 14 }} />
              <label style={label}>The front-door offer</label>
              <div style={{ display: "flex", gap: 4, background: "#ececef", padding: 4, borderRadius: 10, marginBottom: 12 }}>
                {[["manual", "I have my offer"], ["refine", "Refine my idea"], ["brainstorm", "Help me brainstorm"]].map(([v, t]) => (
                  <button key={v} onClick={() => setFrontMode(v)} style={{ flex: 1, fontFamily: "inherit", fontWeight: 700, fontSize: 12, padding: "8px 4px", borderRadius: 7, cursor: "pointer", border: "none", background: frontMode === v ? "#fff" : "transparent", color: frontMode === v ? "#141414" : "#6b6b70", boxShadow: frontMode === v ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}>{t}</button>
                ))}
              </div>

              {frontMode === "manual" && (
                <>
                  <textarea style={{ ...field, minHeight: 60 }} value={manualOffer} onChange={(e) => setManualOffer(e.target.value)} placeholder="Type your front-door offer, e.g. Free listing-ad teardown for one property" />
                  <div style={{ height: 10 }} />
                  <button style={{ ...btn, justifyContent: "center", width: "100%", padding: 12 }} onClick={useManualOffer}>Use this offer</button>
                </>
              )}
              {frontMode === "refine" && (
                <>
                  <textarea style={{ ...field, minHeight: 60 }} value={offerSteer} onChange={(e) => setOfferSteer(e.target.value)} placeholder="What you have in mind, e.g. some kind of free workshop on listing ads, not an audit" />
                  <div style={{ height: 10 }} />
                  <button style={btnState("offers", { ...btn, justifyContent: "center", width: "100%", padding: 12 })} onClick={() => generateOffers(offerSteer)} disabled={busy === "offers"}>{busy === "offers" ? <><Spinner /> Refining</> : "Refine into options"}</button>
                </>
              )}
              {frontMode === "brainstorm" && (
                <button style={btnState("offers", { ...btn, justifyContent: "center", width: "100%", padding: 12 })} onClick={() => generateOffers("")} disabled={busy === "offers"}>{busy === "offers" ? <><Spinner /> Finding offers</> : "Suggest front-door offers"}</button>
              )}

              {offers.length > 0 && (
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {offers.map((o, i) => {
                    const fr = o.friction === "high" ? "#E8242B" : o.friction === "medium" ? "#9a7a0c" : "#1B7A43";
                    const chosen = chosenOffer === o.name;
                    return (
                      <div key={i} style={{ border: chosen ? "2px solid #141414" : "1px solid #ececef", borderRadius: 12, padding: 12, background: chosen ? "#fafafa" : "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                          <div style={{ fontSize: 14.5, fontWeight: 800, color: "#141414", lineHeight: 1.25 }}>{o.name}</div>
                          {o.friction && <Chip text={o.friction + " friction"} color={fr} />}
                        </div>
                        {o.type && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#8E3B8E", margin: "4px 0 6px" }}>{o.type}</div>}
                        {o.why && <div style={{ fontSize: 12.5, color: "#3a3a3e", lineHeight: 1.45, marginBottom: 4 }}><strong>Why it fits:</strong> {o.why}</div>}
                        {o.bridge && <div style={{ fontSize: 12.5, color: "#3a3a3e", lineHeight: 1.45, marginBottom: 8 }}><strong>Leads to your core:</strong> {o.bridge}</div>}
                        <button style={{ ...btnGhost, padding: "7px 12px", fontSize: 12.5 }} onClick={() => useOffer(o)}>{chosen ? "Selected · loaded below" : "Use this offer"}</button>
                      </div>
                    );
                  })}
                  <div style={{ borderTop: "1px solid #f0f0f2", paddingTop: 12, marginTop: 2 }}>
                    <label style={label}>Not quite right? Tell Anvil what to change</label>
                    <textarea style={{ ...field, minHeight: 46 }} value={offerSteer} onChange={(e) => setOfferSteer(e.target.value)} placeholder="e.g. more like a workshop, less audit. Or: make it about listing photos." />
                    <div style={{ height: 8 }} />
                    <button style={btnState("offers", { ...btnGhost, justifyContent: "center", width: "100%" })} onClick={() => generateOffers(offerSteer)} disabled={busy === "offers"}>{busy === "offers" ? <><Spinner /> Regenerating</> : "Regenerate around this"}</button>
                  </div>
                </div>
              )}
            </section>

            <div style={{ display: "flex", gap: 6, background: "#ececef", padding: 4, borderRadius: 10 }}>
              {[["guided", "Guided"], ["expert", "Expert"]].map(([v, t]) => (
                <button key={v} onClick={() => setMode(v)} style={{ flex: 1, fontFamily: "inherit", fontWeight: 700, fontSize: 13, padding: "8px", borderRadius: 7, cursor: "pointer", border: "none", background: mode === v ? "#fff" : "transparent", color: mode === v ? "#141414" : "#6b6b70", boxShadow: mode === v ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}>{t}</button>
              ))}
            </div>

            <section style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{step(1)}Tell us about it</h2>
                <select defaultValue="" onChange={(e) => { loadPreset(e.target.value); e.target.value = ""; }} style={{ ...btnGhost, padding: "5px 9px", fontSize: 12, cursor: "pointer" }}>
                  <option value="" disabled>Load a starter…</option>
                  {Object.keys(PRESETS).map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              {mode === "guided" ? (
                <>
                  {intakeFields.map((f) => {
                    const fromStep0 = f.k === "offer" && chosenOffer;
                    const q = fromStep0 ? "Offer for this ad" : f.q;
                    const ph = fromStep0 ? "Your selected front-door offer. Edit the wording if you like." : f.ph;
                    return (
                      <div key={f.k} style={{ marginBottom: 12 }}>
                        <label style={label}>{q}{f.req && <span style={{ color: "#E8242B" }}> *</span>}</label>
                        {fromStep0 && <div style={{ fontSize: 11, color: "#1B7A43", fontWeight: 700, marginBottom: 5 }}>Loaded from Step 0 · editable</div>}
                        <textarea style={{ ...field, minHeight: f.min, borderColor: fromStep0 ? "#1B7A43" : "#e2e2e6" }} value={intake[f.k]} onChange={(e) => setIn(f.k, e.target.value)} placeholder={ph} />
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 6, marginBottom: 12, borderTop: "1px solid #f0f0f2", paddingTop: 14 }}>
                    <label style={{ ...label, color: "#141414" }}>Paste real market language</label>
                    <p style={{ margin: "0 0 8px", fontSize: 12, color: "#6b6b70", lineHeight: 1.5 }}>Optional, but this is what makes the avatar sharp. Reviews, Reddit or forum posts, comments, call or DM snippets.</p>
                    <textarea style={{ ...field, minHeight: 100, fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 12.5 }} value={intake.corpus} onChange={(e) => setIn("corpus", e.target.value)} placeholder={`"I've spent thousands and still have nothing to show for it."\n"I'm just not a tech person."`} />
                    <div style={{ fontSize: 11, color: corpusTrimmed ? "#7A0E12" : "#9a9aa0", marginTop: 4 }}>{intake.corpus.length.toLocaleString()} characters{corpusTrimmed ? ` · only the first ${CORPUS_CAP.toLocaleString()} read` : ""}</div>
                  </div>
                  <button style={btnState("avatar", { ...btn, justifyContent: "center", width: "100%", padding: 12 })} onClick={buildAvatar} disabled={busy === "avatar"}>{busy === "avatar" ? <><Spinner /> {avatarStage === "research" ? "Researching the market" : "Building your buyer"}</> : (hasCorpus ? "Run research pass + build avatar" : "Build my buyer avatar")}</button>
                </>
              ) : (
                <>
                  <label style={label}>Offer for this ad<span style={{ color: "#E8242B" }}> *</span></label>
                  <textarea style={{ ...field, minHeight: 70 }} value={intake.offer} onChange={(e) => setIn("offer", e.target.value)} placeholder="What this ad promotes. Your front-door offer if you have one, otherwise what you sell." />
                  <div style={{ height: 10 }} />
                  <label style={label}>Market / avatar</label>
                  <textarea style={{ ...field, minHeight: 48 }} value={intake.audience} onChange={(e) => setIn("audience", e.target.value)} placeholder="Who is this for?" />
                  <div style={{ height: 12 }} />
                  <button style={btnState("blocks", { ...btnGhost, width: "100%", justifyContent: "center" })} onClick={draftBlocksExpert} disabled={busy === "blocks"}>{busy === "blocks" ? <><Spinner /> Drafting blocks</> : "Draft the six blocks"}</button>
                </>
              )}

              {/* campaign settings */}
              <div style={{ height: 14 }} />
              <div style={{ borderTop: "1px solid #f0f0f2", paddingTop: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div><label style={label}>Brand name</label><input style={field} value={intake.brandName} onChange={(e) => setIn("brandName", e.target.value)} placeholder="Your Brand" /></div>
                  <div><label style={label}>Website</label><input style={field} value={intake.domain} onChange={(e) => setIn("domain", e.target.value)} placeholder="yourbrand.com" /></div>
                </div>
                <div style={{ height: 10 }} />
                <div style={{ marginBottom: 10 }}><label style={label}>Brand voice</label><select style={field} value={intake.voice} onChange={(e) => setIn("voice", e.target.value)}>{Object.keys(VOICES).map((v) => <option key={v} value={v}>{v} · {VOICES[v].tag}</option>)}</select></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div><label style={label}>Objective</label><select style={field} value={intake.objective} onChange={(e) => setIn("objective", e.target.value)}>{OBJECTIVES.map((o) => <option key={o}>{o}</option>)}</select></div>
                  <div><label style={label}>Placement</label><select style={field} value={platform} onChange={(e) => setPlatform(e.target.value)}>{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select></div>
                </div>
                {isLeadGen && (
                  <div style={{ marginTop: 10 }}>
                    <label style={label}>Lead offer (the free next step)</label>
                    <input style={field} value={intake.leadOffer} onChange={(e) => setIn("leadOffer", e.target.value)} placeholder="Free roof inspection / Free implant consult" />
                    <div style={{ fontSize: 11, color: "#9a9aa0", marginTop: 4 }}>The CTA sells this, not the purchase.</div>
                  </div>
                )}
                <div style={{ marginTop: 12, padding: "10px 12px", background: "#fbfbfc", border: "1px solid #ececef", borderRadius: 8 }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", fontSize: 13, color: "#1c1e21" }}>
                    <input type="checkbox" checked={!!intake.regulated} onChange={(e) => setIn("regulated", e.target.checked)} style={{ marginTop: 2 }} />
                    <span>Regulated vertical (health, medical, legal, financial, or income claims)</span>
                  </label>
                  {intake.regulated && (
                    <div style={{ marginTop: 8 }}>
                      <label style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", fontSize: 12.5, color: "#1c1e21" }}>
                        <input type="checkbox" checked={complianceAck} onChange={(e) => setComplianceAck(e.target.checked)} style={{ marginTop: 2 }} />
                        <span>I will have a human review every claim against platform policy and the relevant board or regulator before any spend. Anvil holds claims to the substantiable and sells the free next step.</span>
                      </label>
                      {!complianceAck && <div style={{ fontSize: 11, color: "#B26B00", marginTop: 6 }}>Generation is paused until this is acknowledged.</div>}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {mode === "guided" && avatar && (
              <section ref={avatarRef} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{step(2)}Your buyer</h2>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", color: conf.c, background: conf.bg, borderRadius: 999, padding: "3px 9px" }}>{conf.t}</span>
                </div>
                {avatar.coverage && <p style={{ margin: "2px 0 14px", fontSize: 12, color: "#6b6b70", fontStyle: "italic" }}>{avatar.coverage}</p>}
                {Array.isArray(avatar.pains) && avatar.pains.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={miniH(BLOCKS.Pain.color)}>Pains, ranked</div>
                    {avatar.pains.map((p, i) => {
                      const obj = typeof p === "string" ? { text: p } : p;
                      return (
                        <div key={i} style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 13, lineHeight: 1.45, color: "#1f1f22" }}>{obj.text}</div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 3 }}>
                            {obj.frequency && <Chip text={obj.frequency + " freq"} color={FREQ[obj.frequency] || "#9a9aa0"} />}
                            {obj.type && <Chip text={obj.type} color="#6b6b70" />}
                          </div>
                          {obj.quote ? <div style={{ fontSize: 12.5, color: BLOCKS.Pain.ink, fontStyle: "italic", marginTop: 3, paddingLeft: 8, borderLeft: `2px solid ${BLOCKS.Pain.color}` }}>“{stripQuoteMarks(obj.quote)}”</div> : null}
                        </div>
                      );
                    })}
                  </div>
                )}
                <AvCol title="How it shows up around them" items={avatar.relationalImpact} color={BLOCKS.Pain.color} />
                <AvLine title="The dream" text={avatar.desire} color={BLOCKS.Promise.color} />
                <AvCol title="If it were fully solved" items={avatar.dreamOutcomes} color={BLOCKS.Promise.color} />
                <AvLine title="Core wound" text={avatar.coreWound} color={BLOCKS.Pain.ink} />
                <AvCol title="Deep fears" items={avatar.fears} color={BLOCKS.Pain.ink} />
                <AvLine title="Who or what they blame" text={avatar.villain} color={BLOCKS.Pain.ink} />
                <AvCol title="Blocking beliefs" items={avatar.beliefs} color={BLOCKS.Constraints.color} />
                <AvCol title="Objections, in their words" items={avatar.objections} color={BLOCKS.Constraints.ink} />
                {Array.isArray(avatar.triedBefore) && avatar.triedBefore.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={miniH(BLOCKS.Curiosity.ink)}>Tried before, and why it failed</div>
                    {avatar.triedBefore.map((t, i) => {
                      const o = typeof t === "string" ? { tried: t } : t;
                      return <div key={i} style={{ fontSize: 13, lineHeight: 1.45, color: "#1f1f22", marginBottom: 3 }}><strong>{o.tried}</strong>{o.whyFailed ? ": " + o.whyFailed : ""}</div>;
                    })}
                  </div>
                )}
                <AvCol title="What they refuse to do" items={avatar.wontDo} color={BLOCKS.Constraints.color} />
                <AvLine title="What solving it costs them" text={avatar.secondaryGain} color={BLOCKS.Constraints.ink} />
                {avatar.constraints && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={miniH(BLOCKS.Constraints.color)}>The 3 big constraints</div>
                    {Object.entries(avatar.constraints).map(([k, v]) => <div key={k} style={{ fontSize: 13, lineHeight: 1.5, color: "#1f1f22" }}><strong>{k}:</strong> {v}</div>)}
                  </div>
                )}
                {Array.isArray(avatar.marketAngles) && avatar.marketAngles.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={miniH(BLOCKS.Curiosity.ink)}>Angles already running</div>
                    {avatar.marketAngles.map((a, i) => {
                      const obj = typeof a === "string" ? { angle: a } : a;
                      const sc = obj.saturation === "high" ? "#E8242B" : obj.saturation === "medium" ? "#9a7a0c" : "#1B7A43";
                      return (<div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 3 }}><span style={{ fontSize: 13, color: "#1f1f22" }}>{obj.angle}</span>{obj.saturation && <Chip text={obj.saturation} color={sc} />}</div>);
                    })}
                    <div style={{ fontSize: 11, color: "#9a9aa0", marginTop: 3 }}>The engine steers Curiosity away from the saturated ones.</div>
                  </div>
                )}
                <AvCol title="Proof the market trusts (you have)" items={avatar.proofTrusted} color={BLOCKS.Proof.color} />
                {Array.isArray(avatar.proofGaps) && avatar.proofGaps.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={miniH("#7A0E12")}>Proof gaps to fill</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.5, color: "#7A0E12" }}>{avatar.proofGaps.map((x, i) => <li key={i}>{x}</li>)}</ul>
                  </div>
                )}
                <AvCol title="Voice of customer" items={avatar.voice} color={BLOCKS.Curiosity.ink} />
                <button style={btnState("blocks", { ...btn, justifyContent: "center", width: "100%", padding: 12, marginTop: 4 })} onClick={buildBlocks} disabled={busy === "blocks"}>{busy === "blocks" ? <><Spinner /> Deriving the six blocks</> : "Build my blocks from this"}</button>
              </section>
            )}

            <section style={card}>
              <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800 }}>{step(3)}The blocks</h2>
              <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#6b6b70" }}>Pre-filled and editable. Each block names the framework it came from.</p>
              {BLOCK_NAMES.map((n) => (
                <div key={n} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <label style={{ ...label, marginBottom: 4, color: BLOCKS[n].ink }}><Dot name={n} />{n}</label>
                    <span style={{ fontSize: 10, color: BLOCKS[n].color, fontWeight: 700 }}>{BLOCKS[n].method}</span>
                  </div>
                  <textarea style={{ ...field, minHeight: 46, borderColor: blocks[n] ? BLOCKS[n].color : "#e2e2e6" }} value={blocks[n]} onChange={(e) => setBlock(n, e.target.value)} placeholder={BLOCKS[n].desc} />
                  {notes[n] && <div style={{ fontSize: 11.5, color: "#9a9aa0", marginTop: 3, fontStyle: "italic" }}>{notes[n]}</div>}
                </div>
              ))}
            </section>

            <section style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Proof pairing</h2>
                <button style={btnState("proof", { ...btnGhost, padding: "6px 10px", fontSize: 12 })} onClick={buildProofPairing} disabled={busy === "proof"}>{busy === "proof" ? <><Spinner /> Matching proof</> : "Suggest proof pairing"}</button>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#6b6b70" }}>Matches proof you actually have to the specific claims you are making. Bigger claims get pushed toward harder-to-fake proof when you have it. Never invents evidence.</p>
              {proofPairing.length > 0 && proofPairing.map((p, i) => {
                const type = PROOF_TYPES.find((t) => t.id === p.proofTypeId);
                return (
                  <div key={i} style={{ borderTop: i > 0 ? "1px solid #f0f0f2" : "none", paddingTop: i > 0 ? 10 : 0, marginTop: i > 0 ? 10 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1e21", marginBottom: 3 }}>{p.claim}</div>
                    {type && <div style={{ marginBottom: 4 }}><Chip text={`${type.category} · ${type.strength}/5${type.underused ? " · underused" : ""}`} color={BLOCKS.Proof.color} /> <span style={{ fontSize: 12, color: "#6b6b70" }}>{type.name}</span></div>}
                    {p.gap ? (
                      <div style={{ fontSize: 12.5, color: "#7A0E12", fontStyle: "italic" }}>No real proof on hand for this claim yet. Worth softening the claim or getting the proof before spending on it.</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 13, color: "#1f1f22", marginBottom: 6 }}>{p.proofText}</div>
                        <button style={{ ...btnGhost, padding: "5px 10px", fontSize: 12 }} onClick={() => setBlock("Proof", p.proofText)}>Use in Proof block</button>
                      </>
                    )}
                  </div>
                );
              })}
            </section>

            <section style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Constraints dissolve</h2>
                <button style={btnState("constraints", { ...btnGhost, padding: "6px 10px", fontSize: 12 })} onClick={buildConstraintsDissolve} disabled={busy === "constraints"}>{busy === "constraints" ? <><Spinner /> Working it</> : "Dissolve an objection"}</button>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#6b6b70" }}>Classifies real objections and beliefs, then either dissolves them or side-steps them. Value and identity objections are never argued with, only reframed.</p>
              {constraintDissolve.length > 0 && constraintDissolve.map((c, i) => {
                const isSidestep = c.strategy === "sidestep" || c.level === "Value" || c.level === "Identity";
                const combined = isSidestep ? c.sidestep : [c.acknowledge, c.wedge, c.elaborate].filter(Boolean).join(" ");
                return (
                  <div key={i} style={{ borderTop: i > 0 ? "1px solid #f0f0f2" : "none", paddingTop: i > 0 ? 10 : 0, marginTop: i > 0 ? 10 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1e21", marginBottom: 3 }}>{c.objection}</div>
                    <div style={{ marginBottom: 4 }}><Chip text={`${c.level} · ${isSidestep ? "side-step" : "dissolve"}`} color={BLOCKS.Constraints.color} /></div>
                    {isSidestep ? (
                      <div style={{ fontSize: 13, color: "#1f1f22", marginBottom: 6 }}>{c.sidestep}</div>
                    ) : (
                      <div style={{ fontSize: 13, color: "#1f1f22", marginBottom: 6, lineHeight: 1.5 }}>
                        <div><span style={{ fontWeight: 700 }}>Acknowledge: </span>{c.acknowledge}</div>
                        <div><span style={{ fontWeight: 700 }}>Wedge: </span>{c.wedge}</div>
                        <div><span style={{ fontWeight: 700 }}>Elaborate: </span>{c.elaborate}</div>
                      </div>
                    )}
                    <button style={{ ...btnGhost, padding: "5px 10px", fontSize: 12 }} onClick={() => setBlock("Constraints", combined)}>Use in Constraints block</button>
                  </div>
                );
              })}
            </section>

            <section style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Curiosity angles</h2>
                <button style={btnState("curiosity", { ...btnGhost, padding: "6px 10px", fontSize: 12 })} onClick={buildCuriosityAngles} disabled={busy === "curiosity"}>{busy === "curiosity" ? <><Spinner /> Finding the gap</> : "Find curiosity angles"}</button>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#6b6b70" }}>Curiosity is the gap between what the market already believes and what you actually see. The last two angles below are the ones worth using, the first two are the saturated take, shown so you can see the gap.</p>
              {curiosityAngles.length > 0 && curiosityAngles.map((a, i) => {
                const q = CURIOSITY_QUADRANTS.find((x) => x.id === a.quadrantId);
                const isYours = a.quadrantId === "your_problem" || a.quadrantId === "your_solution";
                return (
                  <div key={i} style={{ borderTop: i > 0 ? "1px solid #f0f0f2" : "none", paddingTop: i > 0 ? 10 : 0, marginTop: i > 0 ? 10 : 0 }}>
                    <div style={{ marginBottom: 4 }}><Chip text={q ? q.label : a.quadrantId} color={BLOCKS.Curiosity.color} /></div>
                    <div style={{ fontSize: 13, color: "#1f1f22", marginBottom: 6 }}>{a.angle}</div>
                    {isYours && <button style={{ ...btnGhost, padding: "5px 10px", fontSize: 12 }} onClick={() => setBlock("Curiosity", a.angle)}>Use in Curiosity block</button>}
                  </div>
                );
              })}
              {characterizations.length > 0 && (
                <div style={{ marginTop: 14, borderTop: "1px solid #f0f0f2", paddingTop: 12 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#3a3a3e", marginBottom: 6 }}>Naming a mechanism</div>
                  {characterizations.map((c, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1e21" }}>{c.name}</div>
                      <div style={{ fontSize: 12.5, color: "#6b6b70" }}>{c.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{step(4)}The template</h2>
                <button style={btnState("recommend", { ...btnGhost, padding: "6px 10px", fontSize: 12 })} onClick={recommendTemplate} disabled={busy === "recommend"}>{busy === "recommend" ? <><Spinner /> Matching</> : "Recommend"}</button>
              </div>
              <select style={field} value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                <option value="auto">Auto-recommend{recommended ? `: ${TEMPLATES.find((t) => t.id === recommended.id)?.name}` : ""}</option>
                {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.id}. {t.name}</option>)}
              </select>
              {recommended && templateId === "auto" && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#1B79B5", fontStyle: "italic" }}>{recommended.reason}</p>}
              {activeTemplate && (
                <div style={{ marginTop: 12, fontSize: 12.5, color: "#3a3a3e", lineHeight: 1.6, borderTop: "1px solid #f0f0f2", paddingTop: 12 }}>
                  <div style={{ marginBottom: 6, color: "#6b6b70" }}>{activeTemplate.when}</div>
                  <div><strong>Open</strong> · {activeTemplate.opening}</div>
                  <div><strong>Middle</strong> · {activeTemplate.middle}</div>
                  <div><strong>Close</strong> · {activeTemplate.close}</div>
                </div>
              )}
              {isSearch && <div style={{ marginTop: 12, fontSize: 12, color: "#9a9aa0", lineHeight: 1.5 }}>Google Search builds an asset set, not a single ad. The template still steers the angle behind the headlines.</div>}
            </section>

            <button style={btnState("generate", { ...btn, justifyContent: "center", padding: 14, fontSize: 15 })} onClick={generateAd} disabled={busy === "generate"}>{busy === "generate" ? <><Spinner /> {isSearch ? "Writing search ads" : "Generating the ad"}</> : (isSearch ? "Generate search ad assets" : `Generate one ${platform} ad`)}</button>

            {/* A/B test lab */}
            <section style={{ ...card, padding: 16 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800 }}>A/B test lab</h2>
              {isSearch ? (
                <p style={{ margin: 0, fontSize: 12.5, color: "#6b6b70", lineHeight: 1.5 }}>Google rotates the 15 headlines and 4 descriptions automatically, so the asset set is the test. Switch to a feed or video placement to use the A/B lab.</p>
              ) : (
                <>
                  <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#6b6b70" }}>One variable changes, everything else stays fixed. That is how you learn what actually moved the number.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 92px", gap: 8, marginBottom: 10 }}>
                    <div><label style={label}>Test variable</label><select style={field} value={testAxis} onChange={(e) => setTestAxis(e.target.value)}>{AXES.map((a) => <option key={a}>{a}</option>)}</select></div>
                    <div><label style={label}>Variants</label><select style={field} value={testCount} onChange={(e) => setTestCount(Number(e.target.value))}>{[2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
                  </div>
                  <button style={btnState("test", { ...btn, justifyContent: "center", width: "100%", padding: 12 })} onClick={generateTestSet} disabled={busy === "test"}>{busy === "test" ? <><Spinner /> Building {testCount} variants</> : "Generate A/B test set"}</button>
                </>
              )}
            </section>

            {error && <div style={{ background: "#FBE4E5", border: "1px solid #f3b5b8", color: "#7A0E12", padding: "10px 12px", borderRadius: 8, fontSize: 13 }}>{error}</div>}

            <button style={{ ...btnGhost, justifyContent: "center", borderStyle: "dashed", color: "#6b6b70", borderColor: "#d4d4d8" }} onClick={() => setShowRef((s) => !s)}>{showRef ? "Hide" : "Show"} framework reference</button>
            {showRef && (
              <section style={{ ...card, fontSize: 12.5, lineHeight: 1.6, color: "#3a3a3e" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 800 }}>Voice</h3>
                <div style={{ marginBottom: 8 }}>Plain and credible is the default for local businesses and trust markets. It bans hype, fake urgency, and unprovable claims, and keeps Curiosity at a believable level. Ambitious and direct fits the operator audience without the guru act. Raw direct-response is the original style, for supplements and info only.</div>
                <h3 style={{ margin: "8px 0 6px", fontSize: 13, fontWeight: 800 }}>Objective</h3>
                <div style={{ marginBottom: 8 }}>Lead generation sells the free next step, the consult or inspection, not the purchase. The CTA and Conditions block follow. Direct sale drives the buy.</div>
                <h3 style={{ margin: "8px 0 6px", fontSize: 13, fontWeight: 800 }}>Testing discipline</h3>
                <div style={{ marginBottom: 8 }}>Change one variable per test. Give each variant enough budget and time to reach significance. Kill losers, scale the winner, then run the next test. Test hooks and creative first.</div>
                <h3 style={{ margin: "8px 0 6px", fontSize: 13, fontWeight: 800 }}>The six blocks</h3>
                {BLOCK_NAMES.map((n) => <div key={n} style={{ marginBottom: 5 }}><Dot name={n} /><strong style={{ color: BLOCKS[n].ink }}>{n}</strong> · {BLOCKS[n].desc} <span style={{ color: BLOCKS[n].color }}>({BLOCKS[n].method})</span></div>)}
              </section>
            )}
          </div>

          {/* RIGHT */}
          <div ref={resultsRef}>
            {results.length === 0 && (
              <div style={{ ...card, padding: 40, textAlign: "center", color: "#9a9aa0", border: "1px dashed #d4d4d8" }}>
                <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 14 }}>{BLOCK_NAMES.map((n) => <span key={n} style={{ width: 30, height: 30, borderRadius: 6, background: BLOCKS[n].tint, border: `2px solid ${BLOCKS[n].color}` }} />)}</div>
                <div style={{ fontWeight: 700, color: "#3a3a3e", marginBottom: 4 }}>Ads, test sets, and search assets appear here</div>
                <div style={{ fontSize: 13 }}>Tuned to your objective and shaped to the placement.</div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {results.map((r) => r.kind === "test" ? <TestSetView key={r.id} t={r} /> : r.kind === "rsa" ? <RsaCard key={r.id} r={r} /> : <AdPreview key={r.id} r={r} />)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Responsive Search Ad ---------- */
function RsaCard({ r }) {
  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) {} };
  const pathStr = (r.paths || []).filter(Boolean).slice(0, 2).join("/");
  const title = (r.headlines || []).slice(0, 3).join(" | ");
  const desc = (r.descriptions || []).slice(0, 2).join(" ");
  const lenRow = (text, max) => {
    const len = (text || "").length, over = len > max;
    return (
      <div key={text} style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", padding: "6px 0", borderBottom: "1px solid #f4f4f5" }}>
        <span style={{ fontSize: 13.5, color: "#1f1f22", lineHeight: 1.4 }}>{text}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: over ? "#E8242B" : "#9a9aa0", whiteSpace: "nowrap" }}>{len}/{max}</span>
      </div>
    );
  };
  const sec = { fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#6b6b70", margin: "16px 0 4px" };
  const ctl = { fontFamily: "inherit", fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 7, border: "1px solid #d4d4d8", background: "#fff", color: "#141414", cursor: "pointer" };
  return (
    <article style={{ background: "#fff", border: "1px solid #ececef", borderRadius: 14, padding: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#9a9aa0" }}>Google Search · Responsive Search Ad</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={ctl} onClick={() => copy((r.headlines || []).join("\n"))}>Copy headlines</button>
          <button style={ctl} onClick={() => copy((r.descriptions || []).join("\n"))}>Copy descriptions</button>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#8E3B8E", fontWeight: 700, marginBottom: 12 }}>{r.objective}</div>

      <div style={{ background: "#fff", border: "1px solid #ececef", borderRadius: 8, padding: 14, marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: "#202124", marginBottom: 2 }}>Sponsored</div>
        <div style={{ fontSize: 13, color: "#202124" }}>{r.domain}{pathStr ? " › " + pathStr : ""}</div>
        <div style={{ fontSize: 19, color: "#1a0dab", lineHeight: 1.25, margin: "2px 0" }}>{title}</div>
        <div style={{ fontSize: 13.5, color: "#4d5156", lineHeight: 1.45 }}>{desc}</div>
      </div>
      <div style={{ fontSize: 11, color: "#9a9aa0", marginBottom: 8 }}>Google mixes and matches assets, so this is one of many combinations.</div>

      <div style={sec}>Headlines · {(r.headlines || []).length}/15 · {HL_MAX} char limit</div>
      <div>{(r.headlines || []).map((h) => lenRow(h, HL_MAX))}</div>
      <div style={sec}>Descriptions · {(r.descriptions || []).length}/4 · {DESC_MAX} char limit</div>
      <div>{(r.descriptions || []).map((d) => lenRow(d, DESC_MAX))}</div>
      {(r.paths || []).length > 0 && (<><div style={sec}>Display paths · {PATH_MAX} char limit</div><div>{r.paths.map((p) => lenRow(p, PATH_MAX))}</div></>)}

      <div style={{ fontSize: 11.5, color: "#9a9aa0", marginTop: 12, lineHeight: 1.5 }}>Paste these into the Responsive Search Ad builder. Aim for at least 8 to 10 headlines and 3 to 4 descriptions, pin sparingly, and let Google optimize the combinations.</div>
    </article>
  );
}

/* ---------- Test set ---------- */
function TestSetView({ t }) {
  const plan = { background: "#f6f6f7", borderRadius: 10, padding: "10px 12px" };
  const planH = { fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#9a9aa0", marginBottom: 3 };
  return (
    <article style={{ background: "#fff", border: "1px solid #ececef", borderRadius: 14, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#8E3B8E", marginBottom: 4 }}>A/B test · {t.platform}</div>
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.01em", marginBottom: 12 }}>Testing the {String(t.variable).toLowerCase()} · {t.variants.length} variants</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginBottom: 14 }}>
        {t.hypothesis && <div style={plan}><div style={planH}>Hypothesis</div><div style={{ fontSize: 13, color: "#1f1f22", lineHeight: 1.45 }}>{t.hypothesis}</div></div>}
        {t.metric && <div style={plan}><div style={planH}>Watch first</div><div style={{ fontSize: 13, color: "#1f1f22", lineHeight: 1.45 }}>{t.metric}</div></div>}
        {t.nextTest && <div style={plan}><div style={planH}>Test next</div><div style={{ fontSize: 13, color: "#1f1f22", lineHeight: 1.45 }}>{t.nextTest}</div></div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{t.variants.map((v) => <AdPreview key={v.id} r={v} nested />)}</div>
      <div style={{ fontSize: 11.5, color: "#9a9aa0", marginTop: 12, lineHeight: 1.5 }}>Run these as separate ads in one ad set or A/B test, give each enough budget and time to reach significance, then keep the winner and test the next variable.</div>
    </article>
  );
}

/* ---------- Ad preview ---------- */
function AdPreview({ r, nested }) {
  const [open, setOpen] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [anatomy, setAnatomy] = useState(false);
  const isFeed = FEED.includes(r.platform);
  const plainText = r.primaryText.map((s) => s.text).join(" ");
  const copy = (txt) => { try { navigator.clipboard.writeText(txt); } catch (e) {} };
  const allFields = `PRIMARY TEXT:\n${plainText}\n\nHEADLINE: ${r.headline}\nDESCRIPTION: ${r.description}\nCTA: ${r.cta}\nIMAGE: ${r.imageHeadline} / ${r.imageSubline}`;
  const ctl = { fontFamily: "inherit", fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 7, border: "1px solid #d4d4d8", background: "#fff", color: "#141414", cursor: "pointer" };
  const Zone = ({ n, label }) => anatomy ? (
    <div style={{ padding: "8px 12px 2px", display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "#141414", borderRadius: 999, minWidth: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{n}</span>
      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "#65676b" }}>{label}</span>
    </div>
  ) : null;

  const body = () => {
    if (showBlocks) {
      return (
        <div style={{ padding: "0 12px 10px" }}>
          <div style={{ fontSize: 11.5, color: "#65676b", lineHeight: 1.5, margin: "2px 0 8px" }}>These six blocks stack to form your primary text, the copy above the image. The first block is the hook.</div>
          {r.primaryText.map((s, i) => {
            const b = BLOCKS[s.block] || BLOCKS.Curiosity;
            return (
              <div key={i} style={{ background: b.tint, borderLeft: `4px solid ${b.color}`, padding: "8px 10px", margin: "6px 0" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: b.ink, marginBottom: 3 }}>{s.block}{i === 0 ? " · hook" : ""}</div>
                <div style={{ fontSize: 14, lineHeight: 1.45, color: "#1c1e21" }}>{s.text}</div>
              </div>
            );
          })}
          <div style={{ fontSize: 12, color: "#65676b", marginTop: 6 }}>{r.primaryText.length} blocks · {r.words} words · coverage {r.copyVelocity}. Coverage is a thinking aid, not a quality score.</div>
        </div>
      );
    }
    const mb = { color: "#65676b", fontWeight: 700, cursor: "pointer" };
    return (
      <div style={{ padding: "0 12px 10px", fontSize: 14, lineHeight: 1.45, color: "#1c1e21" }}>
        {open ? <span>{plainText} <span style={mb} onClick={() => setOpen(false)}>See less</span></span>
              : <span>{r.primaryText[0] && r.primaryText[0].text} <span style={mb} onClick={() => setOpen(true)}>… See more</span></span>}
      </div>
    );
  };

  return (
    <article style={{ background: "#fff", border: nested ? "1px solid #f0f0f2" : "1px solid #ececef", borderRadius: 14, padding: 14 }}>
      {r.label && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", background: r.isControl ? "#5F6368" : "#141414", borderRadius: 999, padding: "3px 10px" }}>Variant {r.label}{r.isControl ? " · control" : ""}</span>
          {r.note && <span style={{ fontSize: 12.5, color: "#6b6b70" }}>{r.note}</span>}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#9a9aa0" }}>{r.platform}{r.template ? " · " + r.template.name : ""}{r.objective ? " · " + (r.objective === "Lead generation" ? "Lead gen" : "Sale") : ""}</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <button style={ctl} onClick={() => setShowBlocks((s) => !s)}>{showBlocks ? "Hide" : "Show"} blocks</button>
          {isFeed && <button style={ctl} onClick={() => setAnatomy((s) => !s)}>{anatomy ? "Hide" : "Show"} anatomy</button>}
          <button style={ctl} onClick={() => copy(plainText)}>Copy text</button>
          <button style={ctl} onClick={() => copy(allFields)}>Copy all fields</button>
          <div style={{ textAlign: "right", marginLeft: 4 }} title="Coverage is blocks per 100 words. A thinking aid, not a quality score.">
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: "#9a9aa0" }}>{r.copyVelocity}</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#9a9aa0" }}>Coverage</div>
          </div>
        </div>
      </div>

      {isFeed ? (
        <div style={{ background: "#eef0f2", borderRadius: 12, padding: 14, display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 420, background: "#fff", border: "1px solid #dadde1", borderRadius: 8, overflow: "hidden", color: "#050505" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 12px 8px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#141414", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{initials(r.brand)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.brand}</div>
                <div style={{ fontSize: 12, color: "#65676b" }}>{r.platform === "Instagram" ? "Sponsored" : "Sponsored · 🌐"}</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#65676b", fontWeight: 700 }}>···</div>
            </div>
            <Zone n={1} label="Primary text · your 6 blocks stacked" />
            {body()}
            <Zone n={2} label="Creative · your image, with text overlay" />
            <div style={{ aspectRatio: "1 / 1", background: "#101012", display: "flex", flexDirection: "column", justifyContent: "center", padding: 26, color: "#fff", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, display: "flex" }}>{BLOCK_NAMES.map((n) => <span key={n} style={{ flex: 1, background: BLOCKS[n].color }} />)}</div>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.01em" }}>{r.imageHeadline || r.headline}</div>
              {r.imageSubline ? <div style={{ fontSize: 14, color: "#b9b9be", marginTop: 10 }}>{r.imageSubline}</div> : null}
              <div style={{ fontSize: 12, color: "#7c7c82", position: "absolute", bottom: 18, left: 26, letterSpacing: ".04em", textTransform: "uppercase" }}>{r.domain}</div>
            </div>
            <Zone n={3} label="Headline · description · button" />
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f0f2f5", padding: "10px 12px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#65676b", textTransform: "uppercase", letterSpacing: ".02em" }}>{r.domain}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1c1e21", margin: "1px 0" }}>{r.headline}</div>
                <div style={{ fontSize: 13, color: "#65676b" }}>{r.description}</div>
              </div>
              <button style={{ flex: "0 0 auto", background: "#e4e6eb", color: "#050505", fontWeight: 700, fontSize: 14, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer" }}>{r.cta}</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", fontSize: 13, color: "#65676b", borderBottom: "1px solid #ced0d4" }}><span>👍❤️ 1.2K</span><span>184 comments · 37 shares</span></div>
            <div style={{ display: "flex", padding: "4px 6px", fontSize: 14, color: "#65676b", fontWeight: 600 }}>{["Like", "Comment", "Share"].map((a) => <div key={a} style={{ flex: 1, textAlign: "center", padding: 8 }}>{a}</div>)}</div>
          </div>
        </div>
      ) : <FieldsCard r={r} body={body} />}

      {r.hooks && r.hooks.length > 0 && (
        <div style={{ marginTop: 14, borderTop: "1px solid #f0f0f2", paddingTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: BLOCKS.Curiosity.ink, marginBottom: 8 }}><Dot name="Curiosity" />Hook variants to test</div>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.5, color: "#1f1f22" }}>{r.hooks.map((h, i) => <li key={i} style={{ marginBottom: 5 }}>{h}</li>)}</ol>
        </div>
      )}
      {r.craves && Object.keys(r.craves).length > 0 && (
        <div style={{ marginTop: 14, borderTop: "1px solid #f0f0f2", paddingTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#6b6b70", marginBottom: 8 }}>Polish</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(86px, 1fr))", gap: 8 }}>
            {["Clear", "Relevant", "Accurate", "Visual", "Expressive", "Specific"].map((k) => {
              const v = Number(r.craves[k]) || 0;
              return (<div key={k}><div style={{ fontSize: 11, color: "#3a3a3e", marginBottom: 3 }}>{k}</div><div style={{ display: "flex", gap: 2 }}>{[1, 2, 3, 4, 5].map((n) => <span key={n} style={{ flex: 1, height: 5, borderRadius: 2, background: n <= v ? "#141414" : "#e8e8ea" }} />)}</div></div>);
            })}
          </div>
        </div>
      )}
      {r.creativeBrief && (
        <div style={{ marginTop: 14, background: "#141414", color: "#e7e7ea", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#9a9aa0", marginBottom: 4 }}>Creative brief</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{r.creativeBrief}</div>
        </div>
      )}
    </article>
  );
}

function FieldsCard({ r, body }) {
  const note = "Video placement. The primary text is your script and caption. The first segment is the on-screen hook in the opening seconds. The CTA and image headline become on-screen text and the end card.";
  const row = (k, v) => v ? (
    <div style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f0f2" }}>
      <div style={{ flex: "0 0 110px", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#9a9aa0" }}>{k}</div>
      <div style={{ fontSize: 14, color: "#1f1f22", lineHeight: 1.4 }}>{v}</div>
    </div>
  ) : null;
  return (
    <div style={{ background: "#fafafa", borderRadius: 12, padding: 14 }}>
      <div style={{ marginBottom: 8 }}>{body()}</div>
      {row("Headline", r.headline)}
      {row("Description", r.description)}
      {row("CTA", r.cta)}
      {row("Image", [r.imageHeadline, r.imageSubline].filter(Boolean).join(" / "))}
      <div style={{ fontSize: 12, color: "#9a9aa0", marginTop: 10, lineHeight: 1.5 }}>{note}</div>
    </div>
  );
}

const miniH = (c) => ({ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: c, marginBottom: 4 });
function AvCol({ title, items, color }) {
  if (!items || !items.length) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={miniH(color)}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.5, color: "#1f1f22" }}>{items.map((x, i) => <li key={i} style={{ marginBottom: 2 }}>{typeof x === "string" ? x : JSON.stringify(x)}</li>)}</ul>
    </div>
  );
}
function AvLine({ title, text, color }) {
  if (!text) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={miniH(color)}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: "#1f1f22" }}>{text}</div>
    </div>
  );
}
