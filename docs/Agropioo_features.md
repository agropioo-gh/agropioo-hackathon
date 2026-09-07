# Agropioo — Built Feature Overview

> **Project type:** Software-Only (no IoT, no hardware)
> **Approach:** API-driven, AI/ML-powered, full-stack Next.js — Route Handlers only, no separate backend.
> **Builders:** Sheikh Mohammad Ahmed (Team Lead), Mustafa Shahzad (Co-Creator) · Company: Aplinode
> **Hackathon:** AI Hackathon Pakistan 2026 · **Duration:** ~2 weeks

This document lists **only the features built in this project**. Features considered
but deferred (carbon-credit tracking, voice-only UI) are
listed at the end as out-of-scope and are **not** implemented.

---

## Feature Matrix

| # | Feature | Tier | Core tech | Status |
|---|---------|------|-----------|--------|
| 1 | AI Crop Disease Detection | Must-have | TensorFlow.js + HuggingFace (38 classes) + Cloudinary | Built |
| 2 | Smart Weather Advisory | Must-have | OpenWeather + growth-stage-aware AI rules | Built |
| 3 | Mandi Price Tracker & Predictor | Must-have | 5 gov scrapers + 14-day forecast + SELL/HOLD | Built |
| 4 | AI Multi-Agent Chatbot (regional languages) | Differentiator | @openai/agents (8 agents) + RAG (Ollama 768-dim) | Built |
| 5 | Crop Recommendation Engine | Differentiator | Multi-factor scoring over 40+ crops | Built |
| 6 | Farm Profit/Loss Calculator | Differentiator | Season/expense/break-even/ROI | Built |
| 7 | AI Pest Outbreak Prediction | Differentiator | Cron risk scores, growth-stage aware | Built |
| 8 | Digital Farm Records | Must-have | Leaflet map + GPS + 7 record types | Built |
| 9 | App-Control Chat Agent | Differentiator | 12-tool floating agent, streaming | Built |
| 10 | Offline-First PWA | Wow factor | Serwist + IndexedDB + drain-on-reconnect | Built |
| 11 | 8-Language i18n + RTL | Must-have | DB-stored translations, RTL for Urdu/Pashto | Built |

---

## Feature 1 — AI Crop Disease Detection

**Problem:** Farmers lose 20–40% of crops annually to undetected or misdiagnosed disease.

**Solution:** Farmer uploads a photo of an affected leaf/plant → model classifies the
disease → returns disease name, severity (Watch / Treat Now / Clear), and a localized
treatment plan.

**How it works (no hardware):**
- Client compresses the image to 1024px (80% JPEG) before upload.
- Server resizes to 384×384 (`sharp`) before sending to the HuggingFace Inference API
  (`animeshakr/plant-disease-efficientnetv2s`, 38 disease classes).
- Confidence threshold 0.5: below it shows "Could not identify — try a clearer photo."
- Diagnosis images stored on **Cloudinary** (no S3/Firebase).
- Every scan is saved to `detect_scans`; "Save to farm" also writes to the `records` table.
- Follow-up chat per scan; full history with pagination.
- Works offline: photos queue in IndexedDB and process when online.

**Impact:** Early detection can cut crop loss by up to 30%.
**Out of scope:** Voice diagnosis, video feed, batch upload, push notifications.

---

## Feature 2 — Smart Weather Advisory

**Problem:** Generic forecasts don't become actionable decisions.

**Solution:** OpenWeather 5-day / 3-hour forecast + the farm's crop, growth stage, and
soil → farm-specific advisories with alerts for frost, rain, and heat.

**How it works (no hardware):**
- OpenWeather `forecast` endpoint (lat/lon based).
- Growth stage computed from sowing date.
- Advisory generation via cron; per-farm alert centre with acknowledge flow.
- Example: "Your wheat is at tillering stage — delay irrigation 2 days if frost expected."

**Impact:** Avoids unnecessary irrigation before rain — saves water and input costs.

---

## Feature 3 — Mandi Price Tracker & Predictor

**Problem:** Farmers sell at low prices because they can't track markets or predict trends.

**Solution:** Live prices across 5 government sources + 14-day statistical forecast with
SELL/HOLD signals and price alerts.

**Data sources (5):**
| Source | Coverage |
|---|---|
| AMIS (amis.pk) | National commodity prices |
| SAMIS (samis.pk) | Sindh prices |
| FMIS KP (fmis.kp.gov.pk) | Khyber Pakhtunkhwa |
| BMIS | Balochistan prices |
| PBS-SPI | Consumer price index |

**Capabilities:** price history charts, 14-day predictions, SELL/HOLD signals, market
comparison, global mandi search, crop favourites, price alerts, daily ingestion via cron.

**Coverage:** 151 mandis (one per district).

**Impact:** Farmers earn 15–25% more by selling at the right time.

---

## Feature 4 — AI Multi-Agent Chatbot (Regional Languages, Text)

**Problem:** Farmers need answers in their own language, fast.

**Solution:** A text-chat AI advisor with 8 specialized agents that collaborate to answer
any farming question in 8 languages.

**Architecture (8 agents, @openai/agents):**
| Agent | Handles |
|---|---|
| Triage | Routes each query to the right specialist |
| Crop Advisor | Diseases, pests, fertilizer, irrigation, crop/livestock management |
| Weather Agent | Forecasts, rain, spray windows |
| Prices Agent | Mandi rates, timing, market trends |
| Schemes Agent | Government subsidies, loans, insurance |
| Farm Data Agent | The farmer's own farms, records, history |
| Crop Recommendation Agent | What/season to plant, rotation |
| Handoff Agent | Complex or expert-escalation cases |

**RAG:** pgvector similarity search over 21 Pakistan-specific knowledge documents.
Embeddings are generated **locally via Ollama** (`nomic-embed-text`, 768-dim) — no paid
embedding API key required.

**Other capabilities:** conversation memory with summaries, streaming responses (SSE),
input/output guardrails (farming-only), full RTL support for Urdu and Pashto.

**LLM:** OpenAI-compatible API via the `openai` package, model from `ADVISOR_MODEL`
(default `gpt-4o-mini`).

> **Note:** Voice input/output is **out of scope** per the project constitution. The
> advisor is text-chat only until separately specced.

---

## Feature 5 — Crop Recommendation Engine

**Problem:** Farmers plant the same crop every year, ignoring soil, market, and climate.

**Solution:** Multi-factor scoring ranks crops by profitability for the farmer's context.

**How it works:**
- Inputs: soil type, season, budget, irrigation availability, weather, market prices.
- 5-dimension scoring (0–100): Soil(25) + Season(25) + Budget(20) + Irrigation(15) +
  Market/Weather(15).
- 40+ Pakistani crops with yield/duration/capital data; 16 district soil profiles;
  crop-rotation rules.
- Top recommendations shown with comparison charts; can be saved and revisited.

**Impact:** 20–40% income increase through better crop selection.

---

## Feature 6 — Farm Profit/Loss Calculator

**Problem:** Farmers realize losses only after harvest; no financial planning tools.

**Solution:** Create seasons, log expenses, and track projected vs. actual cost,
break-even, and ROI.

- Expense CRUD (categories, amounts, dates); projected costs; break-even bar chart;
  ROI per season and across years; charts for expense breakdown and time series.

**Impact:** First financial-planning tool for smallholders; digital records also enable
bank-loan eligibility.

---

## Feature 7 — AI Pest Outbreak Prediction

**Problem:** Pest attacks destroy harvests overnight; farmers react too late.

**Solution:** Daily risk scores (0–100) per farm, combining weather, crop stage, and
historical incidence, with escalation-aware alerts.

- Cron-generated daily scores; growth-stage-aware; forecast charts; alert notifications
  (warning / critical); history tracking; growth-stage editor.

**Impact:** Early warning can prevent PKR 15,000–50,000/acre in pest damage.

---

## Feature 8 — Digital Farm Records

- Farm creation with Leaflet interactive boundary drawing.
- GPS coordinate capture + Photon geocoding.
- Farm health score (computed from records, weather, growth stage).
- 7 record types: Sowing, Planting, Irrigation, Fertiliser, Pesticide, Disease,
  Harvest — plus expenses, growth stages, and other activities.
- Records are farm-specific, searchable, and feed the AI advisor as context.

---

## Feature 9 — App-Control Chat Agent

- Floating chat on every page of the farmer app.
- 12 tools: create/update/delete records, navigate, weather/prices/P&L summaries,
  handoff to advisor, attachments, confirmations.
- Page-aware context; streaming responses.

---

## Feature 10 — Offline-First PWA

- Serwist service worker for offline caching (replaces Workbox; no separate PWA lib).
- IndexedDB write queue for offline data entry; drain-on-reconnect.
- Client UUIDs for idempotency; offline install prompt (Android/iOS).

---

## Feature 11 — 8-Language i18n + RTL

- Translations stored in the Neon `translations` table (admin-editable, not hardcoded).
- URL-based locale routing (`/[locale]/`).
- Visible language switcher in the nav everywhere (marketing, signup, login, farmer app).
- Language chosen during signup carries into onboarding.
- RTL mirroring + Nastaliq typography for Urdu and Pashto.
- Catalog/translation sync via `scripts/sync-translations.mts` for all 8 locales:
  `en`, `ur`, `pa`, `ps`, `sd`, `skr`, `bal`, `hno`.

---

## Demo Flow (built features only)

> "Meet Ali, a wheat farmer in Punjab. He opens Agropioo on his phone..."

1. Picks Urdu at signup → onboards in Urdu → adds farm by drawing it on the map.
2. Dashboard shows "What to do today": irrigate now; wheat at tillering stage.
3. Asks the advisor in Urdu: "My wheat leaves have yellow spots" → routed to the
   Crop Advisor agent, which checks his farm history and returns grounded advice.
4. Spots a diseased leaf → uploads a photo → AI detects the disease, shows severity
   and treatment → saves it to the farm record.
5. Checks mandi prices → 14-day forecast shows prices rising → SELL/HOLD: "Hold".
6. Receives a frost alert for tomorrow → acknowledges it.
7. Later, switches to offline mode on a poor network → logs an irrigation event; it
   syncs when he's back online.

---