const pptxgen = require("pptxgenjs");

// ── Brand palette (from docs/brand-colors.md) ──────────────────────────
const C = {
  forest: "013B1F", canopy: "1C6428", leaf: "3F8839", sprout: "C1D8C1",
  earth: "8B6F47", wheat: "D4A843",
  stone: "F5F2EC", clay: "E8E0D5",
  ink: "0F172A", slate: "475569", cloud: "94A3B8", paper: "FFFFFF",
  night: "05140C", mint: "F0FDF4", panel: "0E1F13", cardDark: "101B17",
};
const F = { serif: "Playfair Display", body: "DM Sans", mono: "Geist Mono" };

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Agropioo";
pptx.title = "Agropioo — AI Agriculture Advisor for Pakistan";

const W = 10, H = 5.625;
const A = require("path").join(__dirname, "assets");

// ── Helpers ─────────────────────────────────────────────────────────────
const bg = (color) => ({ color });
const base = (color) => { const s = pptx.addSlide(); s.background = bg(C[color] || color); return s; };

// Leafy kicker dot + mono label
function kicker(s, text, x, y, color = "canopy") {
  s.addShape("ellipse", { x: x - 0.16, y: y + 0.09, w: 0.075, h: 0.075, fill: { color: C.leaf }, line: { type: "none" } });
  s.addText(text.toUpperCase(), { x, y, w: 9, h: 0.3, fontFace: F.mono, fontSize: 10, color: C[color] || color, charSpacing: 2, bold: true });
  return y + 0.36;
}

// Signature furrow band at slide bottom
function furrow(s, dark) {
  const hi = dark ? C.sprout : C.leaf, mid = dark ? C.leaf : C.canopy, lo = dark ? C.canopy : C.forest;
  const strips = [
    { y: H - 0.30, x: 0.55, w: 8.9 },
    { y: H - 0.245, x: 0.15, w: 9.7 },
    { y: H - 0.19, x: 0.75, w: 8.5 },
    { y: H - 0.135, x: 0.3, w: 9.4 },
    { y: H - 0.08, x: 0.6, w: 8.8 },
  ];
  const cols = [hi, mid, lo, mid, hi];
  for (let i = 0; i < strips.length; i++) {
    s.addShape("roundRect", { x: strips[i].x, y: strips[i].y, w: strips[i].w, h: 0.04, rectRadius: 0.02, fill: { color: cols[i] }, line: { type: "none" } });
  }
}

// Big serif headline
function head(s, text, x, y, size = 30, color = "forest", w = 8.8) {
  const h = (size / 72) * 2.4 + 0.1;
  s.addText(text, { x, y, w, h, fontFace: F.serif, fontSize: size, color: C[color] || color, valign: "top", breakLine: true });
  return y + h;
}

// Short body text line
function body(s, text, x, y, size = 15, color = "ink", w = 8.6) {
  s.addText(text, { x, y, w, h: 0.6, fontFace: F.body, fontSize: size, color: C[color] || color, valign: "top" });
}

// Rounded card
function card(s, x, y, w, h, fill = "paper", line = "clay", radius = 0.12) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: radius, fill: { color: C[fill] || fill }, line: { color: C[line] || line, width: 1 } });
}

// Green accent bar at top of card
function accentBar(s, x, y, w, color = "canopy") {
  s.addShape("roundRect", { x, y, w, h: 0.06, rectRadius: 0.03, fill: { color: C[color] }, line: { type: "none" } });
}

// Page footer
function footer(s, idx, dark = false) {
  const c = dark ? "sprout" : "cloud";
  furrow(s, dark);
  s.addText("Agropioo  ·  Built for Pakistan", { x: 0.5, y: H - 0.5, w: 4, h: 0.3, fontFace: F.mono, fontSize: 8, color: C[c], charSpacing: 1 });
  s.addText(String(idx).padStart(2, "0"), { x: W - 1.0, y: H - 0.5, w: 0.6, h: 0.3, fontFace: F.mono, fontSize: 9, color: C[c], align: "right" });
}


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER (dark)
// ═══════════════════════════════════════════════════════════════════════
let s = base("night");
// Top accent bands
s.addShape("rect", { x: 0, y: 0, w: W, h: 0.04, fill: { color: C.leaf }, line: { type: "none" } });
s.addShape("rect", { x: 0, y: 0.04, w: W, h: 0.04, fill: { color: C.canopy }, line: { type: "none" } });
s.addShape("rect", { x: 0, y: 0.08, w: W, h: 0.04, fill: { color: C.sprout }, line: { type: "none" } });
// Logo
s.addImage({ path: `${A}/logo-foot-green.png`, x: 0.55, y: 0.45, w: 2.6, h: 0.86 });
// Tagline right
s.addText("BUILT FOR PAKISTAN · READY FOR THE WORLD", { x: 3.6, y: 0.73, w: 5.85, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.sprout, align: "right", charSpacing: 2, bold: true });
// Hero headline
s.addText("The farm knows more", { x: 0.75, y: 1.65, w: 8.6, h: 0.85, fontFace: F.serif, fontSize: 42, color: C.paper, breakLine: true });
s.addText("than the farmer is told.", { x: 0.75, y: 2.5, w: 8.6, h: 0.85, fontFace: F.serif, fontSize: 42, color: C.sprout, breakLine: true });
// Subtext
s.addText("An AI agriculture advisor that knows your farm, your crop, your weather — and tells you what to do and when, in your own language.", { x: 0.78, y: 3.5, w: 7.0, h: 0.8, fontFace: F.body, fontSize: 14, color: C.stone });
// Three pillars
s.addText("GROWTH      ·      INTELLIGENCE      ·      ACCESS", { x: 0.78, y: 4.75, w: 8, h: 0.3, fontFace: F.mono, fontSize: 10, color: C.sprout, charSpacing: 3, bold: true });
// Logo square
s.addImage({ path: `${A}/logo-square.png`, x: 8.05, y: 3.7, w: 1.35, h: 1.35 });
footer(s, 1, true);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE PROBLEM (light)
// ═══════════════════════════════════════════════════════════════════════
s = base("stone");
kicker(s, "The Problem", 0.6, 0.6);
head(s, "45 million farmers making life-and-death decisions on guesswork.", 0.6, 1.15, 30, "forest", 8.6);
const sy = 2.5;
// Three stat cards in a row
card(s, 0.6, sy, 2.75, 2.15, "paper", "clay");
accentBar(s, 0.6, sy, 2.75, "canopy");
s.addText("30–40%", { x: 0.85, y: sy + 0.25, w: 2.3, h: 0.85, fontFace: F.mono, fontSize: 34, bold: true, color: C.canopy });
s.addText("of crops lost yearly\nto preventable causes", { x: 0.85, y: sy + 1.2, w: 2.3, h: 0.7, fontFace: F.body, fontSize: 11, color: C.slate });

card(s, 3.5, sy, 2.75, 2.15, "paper", "clay");
accentBar(s, 3.5, sy, 2.75, "leaf");
s.addText("< 5%", { x: 3.75, y: sy + 0.25, w: 2.3, h: 0.85, fontFace: F.mono, fontSize: 34, bold: true, color: C.leaf });
s.addText("of farms reached by\nextension services", { x: 3.75, y: sy + 1.2, w: 2.3, h: 0.7, fontFace: F.body, fontSize: 11, color: C.slate });

card(s, 6.4, sy, 2.75, 2.15, "paper", "clay");
accentBar(s, 6.4, sy, 2.75, "canopy");
s.addText("0", { x: 6.65, y: sy + 0.25, w: 2.3, h: 0.85, fontFace: F.mono, fontSize: 34, bold: true, color: C.canopy });
s.addText("live data sources\navailable to most farmers", { x: 6.65, y: sy + 1.2, w: 2.3, h: 0.7, fontFace: F.body, fontSize: 11, color: C.slate });
footer(s, 2);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 3 — HUMAN IMPACT (dark)
// ═══════════════════════════════════════════════════════════════════════
s = base("night");
kicker(s, "The human cost", 0.6, 0.6, "sprout");
head(s, "A disease spotted too late.", 0.6, 1.15, 28, "paper", 8.6);
s.addText("A field watered before the rain.", { x: 0.6, y: 2.0, w: 8.6, h: 0.75, fontFace: F.serif, fontSize: 28, color: C.sprout, breakLine: true });
s.addText("A crop sold at the wrong market.", { x: 0.6, y: 2.75, w: 8.6, h: 0.75, fontFace: F.serif, fontSize: 28, color: C.leaf, breakLine: true });
s.addText("For a smallholder family, each of these is not an inconvenience — it is a season's income riding on a guess.", { x: 0.75, y: 3.75, w: 8.5, h: 0.55, fontFace: F.body, fontSize: 15, color: C.stone });
s.addText("The people with the least information have the most to lose.", { x: 0.75, y: 4.35, w: 8.5, h: 0.45, fontFace: F.body, fontSize: 15, color: C.sprout, italic: true });
footer(s, 3, true);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 4 — SOLUTION (light)
// ═══════════════════════════════════════════════════════════════════════
s = base("paper");
kicker(s, "The Solution", 0.6, 0.6);
head(s, "One platform that turns daily crop questions into clear, timed answers.", 0.6, 1.15, 30, "forest", 8.6);
// Four pillars
const pillars = [
  ["ASK", "AI Advisor routes each\nquestion to the right specialist", "canopy"],
  ["SEE", "Photo disease detection,\nlive prices & weather", "leaf"],
  ["KNOW", "Farm records, growth stages\n& profit tracking per field", "leaf"],
  ["GROW", "Crop recommendations &\nschemes you qualify for", "canopy"],
];
let px = 0.6;
for (const [t, d, ccol] of pillars) {
  card(s, px, 2.6, 2.08, 2.3, "stone", "clay");
  accentBar(s, px, 2.6, 2.08, ccol);
  s.addText(t, { x: px + 0.2, y: 2.85, w: 1.7, h: 0.4, fontFace: F.mono, fontSize: 15, bold: true, color: C[ccol], charSpacing: 1 });
  s.addText(d, { x: px + 0.2, y: 3.35, w: 1.72, h: 1.2, fontFace: F.body, fontSize: 11.5, color: C.ink });
  px += 2.2;
}
footer(s, 4);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 5 — WHAT'S BUILT (dark)
// ═══════════════════════════════════════════════════════════════════════
s = base("night");
kicker(s, "What we've built", 0.6, 0.55, "sprout");
head(s, "A working suite of eight tools on one dashboard.", 0.6, 1.02, 28, "paper", 8.6);
const feats = [
  ["AI Advisor", "6 specialist agents · streaming chat", "canopy"],
  ["Disease Detect", "photo scan → diagnosis → treatment", "leaf"],
  ["Pest Prediction", "7-day outbreak risk per farm & crop", "leaf"],
  ["Mandi Prices", "6 gov sources · 14-day forecast", "canopy"],
  ["Weather", "hyperlocal forecast · daily advisory", "canopy"],
  ["Farm Records", "map fields · log every activity", "leaf"],
  ["Profit & Loss", "budget · ROI · break-even tracking", "leaf"],
  ["Crop Planner", "soil + season + market scored picks", "canopy"],
];
let fx = 0.6, fy = 2.15, fw = 2.05, fh = 1.08;
for (let i = 0; i < feats.length; i++) {
  const row = Math.floor(i / 4), col = i % 4;
  const cx = 0.6 + col * (fw + 0.13), cy = 2.15 + row * (fh + 0.16);
  card(s, cx, cy, fw, fh, "cardDark", "canopy", 0.1);
  s.addText(feats[i][0], { x: cx + 0.14, y: cy + 0.12, w: fw - 0.28, h: 0.35, fontFace: F.body, fontSize: 12.5, bold: true, color: C.paper });
  s.addText(feats[i][1], { x: cx + 0.14, y: cy + 0.52, w: fw - 0.28, h: 0.45, fontFace: F.body, fontSize: 9, color: C.sprout });
}
// Bottom tagline
s.addText("8 languages  ·  268 tests  ·  full-stack Next.js  ·  offline PWA", { x: 0.6, y: 4.85, w: 8.8, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.sprout, charSpacing: 1 });
footer(s, 5, true);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 6 — AI ADVISOR (light)
// ═══════════════════════════════════════════════════════════════════════
s = base("paper");
kicker(s, "Innovation · 01 — AI Advisor", 0.6, 0.6);
head(s, "Not a chatbot.\nA triage team of specialist agents.", 0.6, 1.15, 28, "forest", 8.6);
// Left: description
s.addText("A triage orchestrator understands your question and routes it to the right specialist — each with live tool access to your farm records, weather, market prices, and a knowledge base.", { x: 0.6, y: 2.9, w: 5.5, h: 0.85, fontFace: F.body, fontSize: 13, color: C.ink });
s.addText("Streaming responses  ·  conversation memory  ·  persisted history", { x: 0.6, y: 3.85, w: 5.5, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.canopy, charSpacing: 1 });
// Right: 6 agent cards in 3x2 grid
const agents = [
  ["Crop advisor", "field & crop science"],
  ["Weather agent", "live forecast + advice"],
  ["Farm-data agent", "your records & history"],
  ["Prices agent", "markets & projections"],
  ["Schemes agent", "subsidies you qualify for"],
  ["Handoff", "human escalation when needed"],
];
let ax = 6.3, ay = 2.35, aw = 1.72, ah = 1.0;
for (let i = 0; i < agents.length; i++) {
  const col = i % 2, row = Math.floor(i / 2);
  const gx = ax + col * (aw + 0.14), gy = ay + row * (ah + 0.14);
  card(s, gx, gy, aw, ah, "stone", "clay", 0.1);
  s.addText(agents[i][0], { x: gx + 0.12, y: gy + 0.14, w: aw - 0.24, h: 0.45, fontFace: F.body, fontSize: 11, bold: true, color: C.forest });
  s.addText(agents[i][1], { x: gx + 0.12, y: gy + 0.55, w: aw - 0.24, h: 0.35, fontFace: F.body, fontSize: 8.5, color: C.slate });
}
footer(s, 6);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 7 — DISEASE DETECTION (dark)
// ═══════════════════════════════════════════════════════════════════════
s = base("night");
kicker(s, "Innovation · 02 — Disease Detection", 0.6, 0.6, "sprout");
head(s, "A photo of a leaf.\nA diagnosis in seconds.", 0.6, 1.15, 28, "paper", 8.6);
// Left: description
s.addText("Upload a photo of a diseased leaf — the model classifies it across 38+ crop diseases and returns a diagnosis, confidence score, and clear treatment plan.", { x: 0.6, y: 2.8, w: 5.2, h: 0.75, fontFace: F.body, fontSize: 13, color: C.stone });
// Right: scan flow card
card(s, 6.2, 2.2, 3.2, 2.65, "cardDark", "canopy", 0.1);
s.addText("SCAN → DIAGNOSE → TREAT", { x: 6.45, y: 2.4, w: 2.7, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.sprout, charSpacing: 1 });
const scanSteps = [
  ["1", "Upload the affected leaf"],
  ["2", "Classified across 38+ diseases"],
  ["3", "Confidence score + diagnosis"],
  ["4", "Treatment advice, then ask more"],
];
let sy2 = 2.9;
for (const [n, d] of scanSteps) {
  s.addText(n, { x: 6.55, y: sy2 + 0.02, w: 0.35, h: 0.3, fontFace: F.mono, fontSize: 12, bold: true, color: C.leaf });
  s.addText(d, { x: 6.9, y: sy2, w: 2.3, h: 0.4, fontFace: F.body, fontSize: 11, color: C.paper });
  sy2 += 0.48;
}
footer(s, 7, true);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 8 — PEST PREDICTION (light)
// ═══════════════════════════════════════════════════════════════════════
s = base("paper");
kicker(s, "Innovation · 03 — Pest Outbreak Prediction", 0.6, 0.6);
head(s, "Predict the outbreak before it arrives.", 0.6, 1.15, 28, "forest", 8.6);
s.addText("Incidence-driven risk scoring per farm and crop — powered by scraped district data, weather factors, and growth stage analysis.", { x: 0.6, y: 2.5, w: 5.3, h: 0.65, fontFace: F.body, fontSize: 13, color: C.ink });
// Right: feature cards
const pestFeats = [
  ["7-day forecast", "risk score per day with trend chart"],
  ["Per-farm scoring", "weather + growth stage + incidence data"],
  ["Alert system", "mark read / dismiss with notifications"],
  ["Treatment costs", "PKR-priced spray & pesticide advice"],
];
let py = 2.2;
for (const [t, d] of pestFeats) {
  card(s, 6.2, py, 3.2, 0.62, "stone", "clay", 0.08);
  s.addText(t, { x: 6.4, y: py + 0.06, w: 2.8, h: 0.25, fontFace: F.body, fontSize: 11, bold: true, color: C.forest });
  s.addText(d, { x: 6.4, y: py + 0.32, w: 2.8, h: 0.25, fontFace: F.body, fontSize: 9, color: C.slate });
  py += 0.72;
}
footer(s, 8);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 9 — PRICES & WEATHER (dark)
// ═══════════════════════════════════════════════════════════════════════
s = base("night");
kicker(s, "Innovation · 04 — Live Markets & Weather", 0.6, 0.6, "sprout");
head(s, "Real data under real decisions.", 0.6, 1.1, 28, "paper", 8.8);
// Two large cards side by side
card(s, 0.6, 2.3, 4.35, 2.55, "cardDark", "canopy", 0.12);
s.addText("Mandi Prices", { x: 0.85, y: 2.5, w: 3.8, h: 0.4, fontFace: F.serif, fontSize: 20, bold: true, color: C.paper });
s.addText("Live prices from 6 official Pakistani sources with a 14-day statistical forecast and sell / hold signals.", { x: 0.85, y: 3.0, w: 3.85, h: 0.85, fontFace: F.body, fontSize: 12, color: C.stone });
s.addText("Holt–Winters forecast  ·  price alerts  ·  transport cost", { x: 0.85, y: 4.65, w: 3.85, h: 0.25, fontFace: F.mono, fontSize: 9, color: C.sprout, charSpacing: 1 });

card(s, 5.15, 2.3, 4.35, 2.55, "cardDark", "canopy", 0.12);
s.addText("Weather Advisory", { x: 5.4, y: 2.5, w: 3.8, h: 0.4, fontFace: F.serif, fontSize: 20, bold: true, color: C.paper });
s.addText("Hyperlocal forecast woven with your crop and growth stage — one clear advisory: when to irrigate, spray, or protect.", { x: 5.4, y: 3.0, w: 3.85, h: 0.85, fontFace: F.body, fontSize: 12, color: C.stone });
s.addText("OpenWeather  ·  stage-aware rules  ·  daily advisory", { x: 5.4, y: 4.65, w: 3.85, h: 0.25, fontFace: F.mono, fontSize: 9, color: C.sprout, charSpacing: 1 });
footer(s, 9, true);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 10 — DATA BACKBONE (light)
// ═══════════════════════════════════════════════════════════════════════
s = base("stone");
kicker(s, "Innovation · 05 — The Data Backbone", 0.6, 0.6);
head(s, "Advice is only as good as the farm it's grounded in.", 0.6, 1.15, 28, "forest", 8.8);
const dataCards = [
  ["Farm Records", "Every field on a map,\nevery activity logged."],
  ["Profit & Loss", "Budget, spend, ROI\nand break-even per crop."],
  ["Crop Planner", "Soil, season & market\ndemand scored picks."],
];
let dx = 0.6;
for (const [t, d] of dataCards) {
  card(s, dx, 2.7, 2.85, 2.1, "paper", "clay", 0.12);
  accentBar(s, dx, 2.7, 2.85, "canopy");
  s.addText(t, { x: dx + 0.2, y: 2.95, w: 2.45, h: 0.4, fontFace: F.serif, fontSize: 18, color: C.forest });
  s.addText(d, { x: dx + 0.2, y: 3.5, w: 2.45, h: 1.0, fontFace: F.body, fontSize: 12, color: C.ink });
  dx += 2.97;
}
footer(s, 10);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 11 — TECHNOLOGY (dark)
// ═══════════════════════════════════════════════════════════════════════
s = base("night");
kicker(s, "The Technology", 0.6, 0.6, "sprout");
head(s, "Software-only, API-driven, built to run and to scale.", 0.6, 1.15, 28, "paper", 8.8);
const tech = [
  ["Next.js 16", "full-stack, no separate backend"],
  ["Neon Postgres", "Lakebase database, migrations in-repo"],
  ["@openai/agents", "triaging multi-agent advisor"],
  ["Hugging Face", "plant-disease vision model"],
  ["OpenWeather", "hyperlocal forecast feeds"],
  ["6 gov APIs", "live mandi price ingestion"],
  ["pgvector", "knowledge-base semantic search"],
  ["Cloudinary", "scan image storage"],
];
let tx = 0.6, ty = 2.35, tw = 2.16, th = 0.72;
for (let i = 0; i < tech.length; i++) {
  const col = i % 4, row = Math.floor(i / 4);
  const gx = 0.6 + col * (tw + 0.12), gy = 2.35 + row * (th + 0.12);
  card(s, gx, gy, tw, th, "cardDark", "canopy", 0.1);
  s.addText(tech[i][0], { x: gx + 0.14, y: gy + 0.09, w: tw - 0.28, h: 0.28, fontFace: F.body, fontSize: 11, bold: true, color: C.sprout });
  s.addText(tech[i][1], { x: gx + 0.14, y: gy + 0.4, w: tw - 0.28, h: 0.28, fontFace: F.body, fontSize: 8.5, color: C.stone });
}
s.addText("Secured sessions  ·  every route validated  ·  per-IP rate limiting  ·  uniform error shape", { x: 0.6, y: 5.05, w: 8.8, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.sprout, charSpacing: 1 });
footer(s, 11, true);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 12 — FEASIBILITY (light)
// ═══════════════════════════════════════════════════════════════════════
s = base("paper");
kicker(s, "Feasibility — What we've shipped", 0.6, 0.6);
head(s, "Fully working today.", 0.6, 1.1, 32, "forest", 8.8);
// Left: shipped
card(s, 0.6, 2.3, 6.3, 2.75, "stone", "clay", 0.1);
s.addText("SHIPPED & TESTED", { x: 0.85, y: 2.5, w: 5, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: C.canopy, charSpacing: 1 });
const builtCheck = [
  "Full auth — signup, OTP, login, reset",
  "AI advisor · 6 agents · streaming · RAG",
  "Crop disease detection + treatment",
  "Pest outbreak prediction · 7-day forecast",
  "Mandi prices · 6 sources · forecast · alerts",
  "Weather advisory · stage-aware · daily",
  "Farms, records, P&L, crop planner",
  "8 languages with RTL · 268 automated tests",
];
let by = 2.85;
for (const t of builtCheck) {
  s.addText("✓", { x: 0.85, y: by - 0.02, w: 0.3, h: 0.28, fontFace: F.body, fontSize: 12, bold: true, color: C.leaf });
  s.addText(t, { x: 1.18, y: by - 0.02, w: 5.5, h: 0.28, fontFace: F.body, fontSize: 10, color: C.ink });
  by += 0.28;
}
// Right: next
card(s, 7.1, 2.3, 2.35, 2.75, "mint", "clay", 0.1);
s.addText("NEXT", { x: 7.3, y: 2.5, w: 2, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: C.canopy, charSpacing: 1 });
const nextItems = ["Mobile polish", "Full non-English", "Broader schemes", "Scale price sources"];
let ny = 2.85;
for (const t of nextItems) {
  s.addText("→", { x: 7.3, y: ny - 0.02, w: 0.3, h: 0.28, fontFace: F.body, fontSize: 12, bold: true, color: C.canopy });
  s.addText(t, { x: 7.62, y: ny - 0.02, w: 1.75, h: 0.28, fontFace: F.body, fontSize: 10, color: C.ink });
  ny += 0.4;
}
footer(s, 12);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 13 — IMPACT (dark)
// ═══════════════════════════════════════════════════════════════════════
s = base("night");
kicker(s, "The impact", 0.6, 0.6, "sprout");
head(s, "From memory to margin.", 0.6, 1.15, 34, "paper", 8.8);
body(s, "When a farmer knows before they act, the pattern of loss stops repeating.", 0.6, 2.6, 15, "stone", 8.8);
const impact = [
  ["20–40%", "crops lost to preventable causes"],
  ["30–40%", "water wasted irrigating before rain"],
  ["15–25%", "more by selling at the right time"],
  ["8", "languages, one local advisor"],
];
let imx = 0.6, i_hint = 0;
for (const [n, d] of impact) {
  card(s, imx, 3.15, 2.2, 1.85, "cardDark", "canopy", 0.12);
  accentBar(s, imx, 3.15, 2.2, i_hint > 1 ? "leaf" : "canopy");
  s.addText(n, { x: imx + 0.2, y: 3.4, w: 1.85, h: 0.6, fontFace: F.mono, fontSize: 26, bold: true, color: C.leaf });
  s.addText(d, { x: imx + 0.2, y: 4.1, w: 1.85, h: 0.7, fontFace: F.body, fontSize: 10, color: C.stone });
  imx += 2.32;
  i_hint++;
}
footer(s, 13, true);


// ═══════════════════════════════════════════════════════════════════════
// SLIDE 14 — CLOSING / VISION (light)
// ═══════════════════════════════════════════════════════════════════════
s = base("stone");
s.addImage({ path: `${A}/logo-light.png`, x: 0.6, y: 0.55, w: 2.6, h: 0.86 });
head(s, "Built for Pakistan.", 0.75, 1.8, 40, "forest", 8.6);
s.addText("Ready for the world.", { x: 0.75, y: 2.6, w: 8.6, h: 0.75, fontFace: F.serif, fontSize: 40, color: C.canopy, breakLine: true });
body(s, "An agriculture that respects tradition and scales with technology — advice in every farmer's own language, on the phone already in their hand.", 0.78, 3.55, 15, "slate", 7.2);
// CTA button
s.addShape("roundRect", { x: 0.78, y: 4.45, w: 2.6, h: 0.5, rectRadius: 0.25, fill: { color: C.canopy }, line: { type: "none" } });
s.addText("Get early access", { x: 0.78, y: 4.53, w: 2.6, h: 0.35, align: "center", fontFace: F.body, fontSize: 13, bold: true, color: C.paper });
s.addText("agropioo · by Aplinode", { x: 6.6, y: 4.65, w: 2.9, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.cloud, align: "right", charSpacing: 1 });
footer(s, 14);


// ── Write PPTX ─────────────────────────────────────────────────────────
pptx.writeFile({ fileName: require("path").join(__dirname, "Agropioo-Pitch-Deck.pptx") })
  .then(() => console.log("DECK SAVED"))
  .catch((e) => { console.error("SAVE ERR", e); process.exit(1); });