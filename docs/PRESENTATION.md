# Agropioo — AI-Powered Smart Agriculture Platform

### AI Hackathon Pakistan 2026 | Team Submission
### Built by: Sheikh Mohammad Ahmed (Team Lead) & Mustafa Shahzad (Co-Creator) | Aplinode

---

## 1. The Problem

Pakistan's agriculture sector employs **42% of the workforce** and contributes **23% to GDP**, yet farmers operate in information darkness. The core problems:

### Farmers Don't Know What to Do, and When

A smallholder farmer in Punjab growing wheat faces **60+ critical decisions** per season — when to sow, how much fertilizer, which pesticide for which disease, when to irrigate, when to sell. Wrong decisions at any stage can destroy an entire season's income.

### Information is Scattered and Inaccessible

- Weather data is on websites farmers can't read (English-only, desktop-only)
- Mandi (market) prices are controlled by middlemen who exploit information asymmetry
- Government schemes exist but farmers don't know about them
- Agronomic advice is locked behind expensive agronomist consultations (Rs. 2000-5000 per visit)

### Language Barrier Kills Adoption

Pakistan speaks **7 major languages** — Urdu, Punjabi, Pashto, Sindhi, Saraiki, Balochi, Hindko. Every existing agricultural app is English-only or Urdu-only, automatically excluding **91% of farming communities** who don't speak English.

### No Digital Farm Records Exist

Most farmers track nothing. No yield history, no expense records, no soil data. Without records, they can't:
- Prove income for bank loans
- Optimize inputs year-over-year
- Compare seasons to improve practices
- Access crop insurance

### Middlemen Control Prices

Farmers sell at mandis (wholesale markets) without knowing real prices. A wheat farmer in Faisalabad might accept Rs. 3800/maund when the actual market rate is Rs. 4200 — a **10% loss** on every transaction, compounded across thousands of farmers daily.

---

## 2. Our Solution — Agropioo

**Agropioo** is a **Pakistan-first, AI-powered smart agriculture platform** that gives every farmer a personal AI advisor, digital farm records, real-time market intelligence, and disease diagnosis — in their own language.

> "What to do, when to do it" — in the language you speak.

### The Three Pillars

```
┌─────────────────────────────────────────────────────────┐
│                    AGROPIOO PLATFORM                     │
├──────────────────┬──────────────────┬───────────────────┤
│   AI ADVISOR     │  FARM INTELLIGENCE│  MARKET ACCESS    │
│                  │                   │                   │
│ • Chat in 8      │ • Digital farm    │ • Live mandi      │
│   languages      │   records         │   prices          │
│ • Disease detect │ • Weather alerts  │ • 14-day price    │
│   from photos    │ • Crop planning   │   forecasts       │
│ • Pest outbreak  │ • Profit/loss     │ • Price alerts    │
│   prediction     │   tracking        │ • Sell/Hold tips  │
│ • RAG knowledge  │ • Soil mapping    │ • Mandi search    │
│   base           │ • PWA offline     │                   │
└──────────────────┴──────────────────┴───────────────────┘
```

---

## 3. Who We Serve

### Primary: Smallholder Farmers (0.5–5 acres)

- **40 million+ farming households** in Pakistan
- Average income: Rs. 150,000–300,000/year
- Phone: Android smartphone (budget devices, intermittent connectivity)
- Literacy: Low — need simple, conversational UX, local language, simple navigation

### Secondary: Field Workers

- Need dashboard views, farm-level summaries, bulk advisory capability

### Tertiary: Agri-Businesses 

- Seed companies, fertilizer suppliers, banks
- Anonymized aggregate data for crop forecasting

---

## 4. Features Built — Complete Platform

### 4.1 AI Agriculture Advisor (Multi-Agent System)

**The brain of Agropioo.** Not a simple chatbot — a multi-agent AI system with 8 specialized agents that collaborate to answer any farming question.

```
                    Farmer asks a question
                            │
                    ┌───────▼───────┐
                    │   TRIAGE      │   (routes to the right specialist)
                    │   (Router)    │
                    └───────┬───────┘
                            │
            7 Specialists (direct handoffs):
              • Crop Advisor — disease, pests, fertiliser, irrigation
              • Weather Agent — forecasts, rain, spray windows
              • Prices Agent — mandi rates, market trends
              • Schemes Agent — subsidies, loans, insurance
              • Farm Data Agent — own farms, records, history
              • Crop Rec. Agent — what/season to plant, rotation
              • Handoff Agent — expert escalation
                            │
                            ▼
        RAG: 21 knowledge docs (Ollama nomic-embed-text, 768-dim pgvector)
          + farm data → grounded answer (streaming, 8 languages, Urdu/Pashto RTL)
```

**How it works:**
- **RAG (Retrieval-Augmented Generation)**: 21 knowledge base documents (wheat, rice, cotton, maize, sugarcane, pulses, vegetables, fruits, livestock, fertilizer guides, pesticide guides, government schemes) chunked and embedded locally via Ollama nomic-embed-text (768-dim vectors) in PostgreSQL with pgvector
- **Multi-agent routing**: The orchestrator detects the question topic and delegates to the right specialist
- **Input/Output Guardrails**: 303-line farming-only keyword filter ensures the AI never goes off-topic (English + Urdu)
- **Conversation Memory**: Summarized conversation history for context-aware responses
- **Streaming responses** with markdown rendering for formatted advice
- **8-language support**: Farmer types in Urdu, gets answer in Urdu. Roman Urdu works too.

**Tech**: `@openai/agents` SDK, OpenAI LLM (gpt-4o-mini), pgvector embeddings, streaming SSE

### 4.2 AI Crop Disease Detection

**Take a photo → Get a diagnosis → Know what to do.**

```
Farmer uploads photo
        │
        ▼
┌───────────────┐     ┌──────────────┐     ┌───────────────┐
│  Cloudinary   │────▶│  TensorFlow  │────▶│  AI Diagnosis │
│  (Image Store)│     │  (Detection) │     │  + Treatment  │
└───────────────┘     └──────────────┘     └───────────────┘
```

- Upload crop photo from phone camera
- TensorFlow.js model identifies disease/pest
- Returns: disease name, confidence score, severity (low/medium/high), causes, step-by-step treatment plan, rescan timing
- Cloudinary stores images with automatic optimization
- **Scan history** with follow-up chat for each diagnosis
- Works offline — photos queue in IndexedDB and sync when connected

### 4.3 Weather Advisory System

**Personalized weather intelligence per farm.**

- **5-day forecasts** from OpenWeather API, refreshed every 6 hours
- **Farm-specific advisories** based on: current crop growth stage, soil type, irrigation method
- **Alert system**: Heavy rain, frost, extreme heat, disease risk — each with severity levels
- **Growth-stage-aware advice**: "Your wheat is at tillering stage — delay irrigation by 2 days if frost expected"
- **Acknowledge flow**: Farmer marks alerts as read/acted for accountability
- **Historical weather log** for each farm

### 4.4 Mandi Price Tracker & Predictor

**Know what your crop is worth — before you go to market.**

- **Live prices** for 40+ crops across 151 mandis (agricultural wholesale markets)
- **14-day price forecasts** with **SELL/HOLD recommendations**
- **Automated scraping**: GitHub Actions cron jobs pull data from official sources:
  - amis.pk (Punjab Agriculture Information Service)
  - samis.pk (Sindh)
  - fmis.kp (Khyber Pakhtunkhwa)
  - bmis_balochistan
  - pbs_spi (Pakistan Bureau of Statistics)
- **Price alerts**: Set target price, get notified when market hits it
- **Favorites**: Star your crops, see them on dashboard
- **Data freshness tracking** with scraper audit logs

### 4.5 Crop Recommendation Engine

**Multi-factor AI scoring for what to plant next.**

- Considers: soil type, season, budget, irrigation access, weather patterns, market prices
- **40+ Pakistan crops** in database with yield data, duration, capital requirements
- **Soil compatibility matrix**: Which crops grow in which soil types across 16 districts
- **Crop rotation rules**: "After wheat, plant gram or canola — avoid cotton for 2 years"
- **5-dimension scoring**: Soil fit (0-25), Season fit (0-25), Budget fit (0-20), Irrigation fit (0-15), Market/Weather confidence (0-15)
- **Plan generation**: Full planting schedule with expected costs and yields

### 4.6 Profit & Loss Calculator

**Track every rupee — know your real margins.**

- Create seasons per crop, per year
- Log expenses by category: seed, fertilizer, labor, irrigation, transport, other
- **Projected costs** vs actual spend tracking
- **Break-even analysis** with visual charts
- **ROI calculation** per season and across years
- **Revenue tracking**: Expected yield × price vs actual
- Expense time-series charts, category breakdowns
- Archive/restore for historical seasons

### 4.7 AI Pest Outbreak Prediction

**Predict problems before they arrive.**

- **Risk scores** (0–100) generated daily via cron job
- Considers: weather patterns, historical incidence data, farm crop type
- **Pest alerts** with severity (warning/critical)
- **Escalation tracking**: New alert can reference an existing one getting worse
- **Treatment catalog**: Chemical and organic options with price snapshots
- **Incidence database**: Province/district/crop/pest daily records

### 4.8 App-Control Chat Agent

**Universal remote for the entire platform.**

- **Floating chat widget** on every page of the farmer app
- **12 tools** the agent can use:
  - Create/update/delete farm records
  - Navigate to any page
  - Get weather summary
  - Get price summary
  - Get profit/loss summary
  - Handoff to AI Advisor for complex questions
  - Handle attachments (photos)
  - Confirmation flows for destructive actions
- **Page-aware context**: Knows which page the farmer is on
- **Role-based responses**: farmer / agent / system messages

### 4.9 Digital Farm Records

**From zero to organized — every farm, every season.**

- Farm profiles with map drawing (Leaflet + Leafoman drawing tools)
- GPS coordinates via geocoding
- **Record types**: Sowing, Plant, Irrigation, Fertilizer, Pesticide, Disease, Harvest
- **Season tracking**: Which crop, which season, which year
- **Weather snapshots**: Weather conditions at time of each record
- **Yield & cost tracking**: Labor, transport, input costs per record
- Growth stage management per farm

### 4.10 Offline-First PWA

**Works without internet — because farms don't have fiber.**

- **Serwist service worker** for intelligent caching
- **IndexedDB write queue**: Actions performed offline are stored locally
- **Idempotent replay**: When connection returns, queued actions sync with server-generated UUIDs preventing duplicates
- **Offline photo uploads**: Photos queue and process through disease detection when online
- **PWA install prompt**: One-tap install on Android, manual on iOS

### 4.11 8-Language System (i18n + RTL)

**The widest reach of any ag-tech platform in Pakistan.**

| Language | Speakers | Priority | Status |
|----------|----------|----------|--------|
| English | — | Default | Built |
| Urdu | ~9% national | P1 | Built |
| Punjabi | ~37% Punjab | P2 | Built |
| Pashto | ~18% KPK | P3 | Built |
| Sindhi | ~14% Sindh | P4 | Built |
| Saraiki | ~12% S. Punjab | P5 | Built |
| Balochi | ~3% Balochistan | P6 | Built |
| Hindko | ~2% Hazara | P7 | Built |

- **Database-stored translations**: Admin-editable via Neon dashboard, not hardcoded
- **URL slugs**: `/ur/dashboard`, `/pa/farms`, `/sd/prices`
- **RTL mirroring**: Urdu and Pashto render right-to-left with fully mirrored layouts
- **Nastaliq & Arabic fonts**: Proper Urdu typography with NastaliqUrdu font
- **Language switcher** in nav everywhere — not hidden in settings

### 4.12 Notifications Center

- Bell icon with unread count
- Per-feature notifications: price alerts, weather alerts, pest alerts
- Notification history

### 4.13 Marketing Site

- **Landing page** with Agropioo brand story
- **Why Agropioo** page — problem deep-dive
- **How It Works** page — step-by-step platform walkthrough
- **Vision** page — roadmap and impact goals
- **Early access signup** with email verification

---

## 5. The Innovation

### 5.1 Multi-Agent AI Architecture

Unlike simple chatbots, Agropioo uses a **collaborative multi-agent system** where specialized AI agents work together. The orchestrator routes questions to the right expert, and agents can hand off to each other. This gives deeper, more accurate answers than a single general-purpose AI.

### 5.2 RAG with Domain-Specific Knowledge

The AI doesn't hallucinate farming advice. It retrieves from **21 curated knowledge documents** covering Pakistan-specific crops, practices, fertilizers, pesticides, and government schemes — then generates answers grounded in real agricultural science.

### 5.3 Language-First, Not Language-Added

Most platforms add Urdu as an afterthought. Agropioo was **built language-first** — the architecture assumes 8 languages from day one, with database-stored translations, RTL layouts, and Nastaliq typography as first-class features, not patches.

### 5.4 Offline-First for Real Connectivity

Farmers in rural Sindh or Balochistan have 2G connections that drop constantly. Agropioo's PWA with IndexedDB queue means **the app works in airplane mode** — records queue locally and sync when signal returns. No data loss.

### 5.5 Crop-Level Price Prediction with SELL/HOLD

Not just showing prices — **telling farmers what to do with them**. The 14-day forecast with actionable recommendations empowers farmers to time their sales for maximum profit.

### 5.6 Growth-Stage-Aware Weather Advisories

Generic weather apps say "rain tomorrow." Agropioo says "rain tomorrow — but your wheat is at tillering stage, so delay irrigation by 2 days." **Context-aware advice is the difference between information and intelligence.**

---

## 6. Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 16.3 | Full-stack React framework (App Router, React Server Components) |
| React 19 | UI library |
| TypeScript 5 | Type safety (strict mode, zero `any`) |
| Tailwind CSS v4 | Utility-first styling with custom brand tokens |
| Leaflet + React-Leaflet | Interactive farm maps with polygon drawing |
| Serwist | Service worker for PWA/offline |
| react-hook-form + Zod | Form validation |
| react-markdown | Advisor response rendering |

### Backend & Database
| Technology | Purpose |
|-----------|---------|
| Next.js Route Handlers | API layer (no separate backend) |
| Neon Lakebase Postgres | Serverless PostgreSQL with branching |
| pgvector | Vector embeddings for RAG search |
| bcryptjs | Password hashing |
| jose | JWT in httpOnly cookies |
| nodemailer | Email (SMTP) for OTP/verification |

### AI & ML
| Technology | Purpose |
|-----------|---------|
| @openai/agents | Multi-agent orchestration |
| OpenAI SDK | LLM inference (gpt-4o-mini) |
| Ollama nomic-embed-text | 768-dim local embeddings for RAG |
| TensorFlow.js | Client-side crop disease detection |
| HuggingFace | Pre-trained disease classification model |

### External Services
| Technology | Purpose |
|-----------|---------|
| Cloudinary | Image upload, storage, optimization |
| OpenWeather API | 5-day weather forecasts |
| Photon (geocoding) | Address-to-coordinate conversion |
| GitHub Actions | Cron jobs for price scraping + pest prediction |

### DevOps & Quality
| Technology | Purpose |
|-----------|---------|
| Vitest | Unit testing |
| Playwright | E2E testing |
| GitHub Actions CI | Automated cron jobs |

---

## 7. Database Architecture

**16 migrations** creating a comprehensive schema:

```
┌─────────────────────────────────────────────────────────┐
│                    NEON POSTGRES                         │
├─────────────────────────────────────────────────────────┤
│  AUTH          │ users, sessions, verification_codes,   │
│                │ pass_states (JWT state machine)         │
├─────────────────────────────────────────────────────────┤
│  FARMS         │ farms (with GPS, crop info, growth     │
│                │ stages), records (7 types)              │
├─────────────────────────────────────────────────────────┤
│  AI ADVISOR    │ conversations, messages, knowledge_     │
│                │ documents, knowledge_chunks (pgvector)  │
├─────────────────────────────────────────────────────────┤
│  DETECT        │ detect_scans (disease diagnosis),       │
│                │ detect_chats, detect_messages            │
├─────────────────────────────────────────────────────────┤
│  WEATHER       │ weather_advisories, weather_alerts       │
├─────────────────────────────────────────────────────────┤
│  PRICES        │ crops (40+), mandis (151), mandi_      │
│                │ prices, price_predictions, price_alerts  │
├─────────────────────────────────────────────────────────┤
│  CROPS         │ crop_soil_compatibility, rotation_      │
│                │ rules, soil_profiles (16 districts),     │
│                │ recommendation_requests, recommendations │
├─────────────────────────────────────────────────────────┤
│  P&L           │ seasons, expenses, projected_costs       │
├─────────────────────────────────────────────────────────┤
│  PEST          │ pest_predictions, pest_alerts, pest_     │
│                │ incidence_records, pest_treatments        │
├─────────────────────────────────────────────────────────┤
│  APP CONTROL   │ app_control_conversations, messages      │
├─────────────────────────────────────────────────────────┤
│  I18N          │ translations (8 locales, public read)    │
├─────────────────────────────────────────────────────────┤
│  NOTIFICATIONS │ notifications table                      │
└─────────────────────────────────────────────────────────┘
```

---

## 8. API Architecture

**66 Route Handlers** across these groups:

```
/api/auth/          → signup, login, logout, verify-email, forgot-password, reset-password, me
/api/farms/         → CRUD, archive, restore, list
/api/records/       → CRUD by farm, seasonal aggregation
/api/advisor/       → chat (streaming SSE), conversations, messages
/api/detect/        → scan (photo upload → diagnosis), history, chat
/api/weather/       → current forecast, advisories, alerts, history
/api/prices/        → crops, mandis, current prices, predictions, alerts, favorites, ingest (cron)
/api/crops/         → catalog, soil profiles, recommendations, rotation plans
/api/profit-loss/   → seasons, expenses, projected costs, summary
/api/pest/          → predictions, alerts, treatments, incidence, history
/api/control/       → app-control agent (12 tools)
/api/notifications/ → list, mark-read
/api/i18n/          → translations lookup
```

**Security model:**
- Zod validation on every input
- JWT httpOnly cookies (unreadable from JS)
- Per-IP rate limiting on auth routes
- Server-side authorization checks
- Uniform error shape: `{ error: { code, message } }`

---

## 9. Feasibility & What's Been Built

### Build Status

| Feature | Status | Demo Ready |
|---------|--------|------------|
| Authentication (signup/login/OTP/forgot) | ✅ Complete | ✅ |
| Onboarding (language, profile, first farm) | ✅ Complete | ✅ |
| Dashboard ("What to do today") | ✅ Complete | ✅ |
| Farm Management (list, create, map) | ✅ Complete | ✅ |
| Farm Records (7 types, seasons) | ✅ Complete | ✅ |
| AI Advisor (multi-agent, RAG, 8-lang) | ✅ Complete | ✅ |
| Disease Detection (photo → diagnosis) | ✅ Complete | ✅ |
| Weather Advisory (per-farm, alerts) | ✅ Complete | ✅ |
| Mandi Price Tracker (live + forecast) | ✅ Complete | ✅ |
| Crop Recommendation Engine | ✅ Complete | ✅ |
| Profit/Loss Calculator | ✅ Complete | ✅ |
| Pest Outbreak Prediction | ✅ Complete | ✅ |
| App-Control Chat Agent | ✅ Complete | ✅ |
| Offline PWA + Sync | ✅ Complete | ✅ |
| i18n + RTL (8 languages) | ✅ Complete | ✅ |
| Notifications Center | ✅ Complete | ✅ |
| Marketing Site | ✅ Complete | ✅ |

### Demo Strategy

The app includes **built-in demo modes**:
- `DEMO_MODE=true` enables verification code display (no real email needed)
- Query params for empty states: `?view=empty`, `?weather=off`
- Dashboard is live-DB driven with demo fallbacks
- Knowledge base is pre-seeded with 21 Pakistan-specific agricultural documents
- Crop database pre-loaded with 40+ Pakistani crops
- Mandi data seeded for 151 markets

### What Runs Today

```
┌─────────────────────────────────────────────┐
│         FULLY FUNCTIONAL PLATFORM            │
│                                              │
│  • Working signup/login with JWT auth        │
│  • AI advisor answering real farming Q's     │
│  • Photo upload → disease diagnosis          │
│  • Live weather advisories per farm          │
│  • Mandi prices with 14-day forecasts        │
│  • Crop recommendations based on soil+season │
│  • Profit/loss tracking with charts          │
│  • Pest outbreak prediction with alerts      │
│  • Chat agent controlling the entire app     │
│  • Works offline on low-bandwidth            │
│  • All in 8 Pakistani languages              │
│                                              │
│  16 database migrations                     │
│  66 API endpoints                          │
│  85+ components                           │
│  105+ scripts                               │
│  21 knowledge base documents                │
│  40+ crop profiles                          │
│  151 mandi listings                        │
└─────────────────────────────────────────────┘
```

---

## 10. Impact & Scale Potential

### Immediate Impact (Pilot)

- **1 farmer, 1 season**: Save Rs. 30,000–80,000 through better timing (price prediction) + disease prevention (early detection) + optimized inputs (crop recommendation)
- **Measurable**: Every decision is logged → ROI is calculable

### District Scale (6 months)

- **10,000 farmers in 1 district**: Aggregate data reveals patterns — which pests are spreading, which crops are most profitable, where soil needs amendment
- **Bank partnerships**: Digital farm records → loan eligibility for 40M unbanked farmers

### National Scale (2 years)

- **All 8 languages live**: No competitor offers this breadth
- **Government integration**: Scheme alerts, subsidy distribution, crop insurance claims
- **Data moat**: Every farm record, every price prediction, every disease scan improves the system for everyone

### Revenue Model

| Stream | Description |
|--------|------------|
| **Freemium AI Advisor** | Basic questions free, deep analysis premium (Rs. 99/month) |
| **B2B Agri-Tech** | Seed/fertilizer companies access anonymized farmer data for R&D |
| **Insurance Integration** | Digital records enable crop insurance (commission-based) |
| **Mandi Commission** | Market linkage: farmer sells through Agropioo → small commission |

---

## 11. What Makes This Different

| Feature | Agropioo | Competitors |
|---------|----------|------------|
| Languages | 8 (Urdu, Punjabi, Pashto, Sindhi, Saraiki, Balochi, Hindko, English) | 1-2 max |
| AI Architecture | Multi-agent with RAG + domain knowledge | Simple chatbot or rule-based |
| Offline Support | Full PWA with sync queue | None |
| Price Prediction | 14-day forecast with SELL/HOLD | Current price only |
| Farm Records | Complete digital ledger with P&L | Basic or none |
| Disease Detection | Photo → AI diagnosis → treatment plan | Text-only advice |
| Pest Prediction | Daily risk scores per farm | Reactive (after outbreak) |
| RTL Support | Full mirroring with Nastaliq typography | Text translation only |
| Open Architecture | Neon Postgres, open APIs, modular agents | Monolithic, closed |

---

## 12. Development Approach

### Spec-Driven Development (SDD)

Every feature follows: **Constitution → Research → Specify → Clarify → Build**

- No code without a spec
- Specs are the source of truth — code is the output
- Founder reviews every diff against spec
- Acceptance criteria verified before merge

### Build Record

- **Timeline**: Mid-August to Early September 2026 (~2 weeks)
- **Builders**: Sheikh Mohammad Ahmed (Team Lead) & Mustafa Shahzad (Co-Creator)
- **Commits**: Atomic, meaningful, imperative mood
- **Architecture**: 16 database migrations, 66 API routes, 85+ components, 105+ scripts
- **Documentation**: 30+ spec files, 3 ADRs, full information architecture

---

## 13. The Team

**Sheikh Mohammad Ahmed** (Team Lead) & **Mustafa Shahzad** (Co-Creator)
- Company: Aplinode
- Built the entire platform: frontend, backend, AI, database, DevOps, design
- 16 database migrations, 66 API endpoints, 14 features

---

## 14. Demo Script (5 Minutes)

### Minute 1: Problem Statement
> "42% of Pakistan works in agriculture. Farmers make 60+ critical decisions per season with zero digital tools. Existing apps are English-only, requiring Rs. 2000+ agronomist visits for advice. Information asymmetry costs farmers 10-15% of income through middleman exploitation."

### Minute 2: AI Advisor Live Demo
> "Watch: I'm a wheat farmer in Sindh. I type in Urdu: 'Mere khet mein pattiyaan peeli ho rahi hain, kya karoon?' — What should I do, my leaves are turning yellow?"
> [Show multi-agent routing → RAG retrieval → Urdu response with specific treatment steps]
> "The AI checked 8 specialized agents, retrieved from our knowledge base, and answered in Urdu with a 5-step treatment plan."

### Minute 3: Disease Detection + Weather
> "I take a photo of my crop..." [upload photo] "...and within seconds I get: Disease detected — Leaf Rust, 87% confidence, severity HIGH. Here are 3 treatment options with costs."
> "And my weather advisory says: Heavy rain expected in 48 hours — delay your pesticide spray or it will wash off. Your wheat is at tillering stage, so..."

### Minute 4: Market Intelligence
> "I check mandi prices — wheat is trading at Rs. 4,200/maund in Faisalabad. The 14-day forecast says prices will rise 8%. SELL recommendation: HOLD for 2 weeks."
> "This farmer just saved Rs. 336 per maund by not selling today."

### Minute 5: Scale & Vision
> "This platform speaks 8 languages. It works offline. It has 40+ crops, 151 mandis, 16 district soil profiles. And it was built in 2 weeks by a two-person team. The vision: every Pakistani farmer with a smartphone has a personal AI agronomist, in their own language, for free."

---

## 15. Technical Innovation Summary

| Innovation | Why It Matters |
|-----------|----------------|
| Multi-agent AI with RAG | Deep, accurate answers — not hallucinated generic advice |
| 8-language architecture | Reaches 91% of Pakistan's farming population |
| Growth-stage-aware advisories | Context turns data into actionable intelligence |
| Offline-first PWA | Works on 2G connections in rural areas |
| Database-stored translations | Admin-editable, no code deployments needed |
| Idempotent offline sync | Zero data loss on intermittent connectivity |
| Crop-level price prediction | Farmers sell smarter, earn more |
| State-backed JWT auth | Secure session management with state machine |
| pgvector RAG search | Vector similarity for domain-specific knowledge retrieval |
| Cron-driven intelligence | Automated price scraping + pest prediction daily |

---

## Appendix A: File Structure Overview

```
agropioo-hackathon/
├── app/
│   ├── (farmer)/          # Farmer app routes
│   │   ├── (dashboard)/   # Dashboard, farms, advisor, detect, weather, prices, etc.
│   │   ├── onboarding/    # First-time user flow
│   │   └── verify/        # Email verification
│   ├── (site)/            # Marketing site
│   │   └── [locale]/      # Localized marketing pages
│   ├── api/               # 66 Route Handlers
│   ├── fonts/             # Local font files (Playfair, DM Sans, Nastaliq, etc.)
│   └── globals.css        # Tailwind + brand tokens
├── components/            # 85+ React components
│   ├── app-control/       # Universal chat agent
│   ├── auth/              # Auth forms
│   ├── offline/           # PWA providers
│   ├── pest/              # Pest prediction UI
│   ├── prices/            # Mandi price components
│   ├── profit-loss/       # P&L calculator
│   ├── records/           # Farm record components
│   ├── shell/             # App chrome (sidebar, tabs, header)
│   ├── weather/           # Weather dashboard
│   └── icons.tsx          # Hand-built SVG icon set
├── catalog/               # i18n typed string catalogs
├── data/                  # Knowledge base (21 docs)
├── db/migrations/         # 16 Neon Postgres migrations
├── docs/                  # Product docs, brand, ADRs
├── lib/
│   ├── advisor/           # Multi-agent system + guardrails
│   ├── detect/            # Disease detection pipeline
│   ├── pest/              # Pest prediction engine
│   ├── weather/           # Weather advisory logic
│   ├── prices/            # Price prediction logic
│   ├── db.ts              # Shared Neon Postgres client
│   ├── serwist/           # Service worker config
│   └── i18n/              # Locale registry + helpers
├── scripts/               # 105+ utility scripts
├── specs/                 # 30+ feature specifications
├── adrs/                  # Architecture Decision Records
└── public/                # Static assets
```

---

## Appendix B: Key Metrics

| Metric | Value |
|--------|-------|
| Database migrations | 16 |
| API route handlers | 66 |
| React components | 85+ |
| Utility scripts | 105+ |
| Knowledge base documents | 21 |
| Supported crops | 40+ |
| Tracked mandis | 151 |
| District soil profiles | 16 |
| Supported languages | 8 |
| Feature specs | 30+ |
| ADRs | 3+ |
| Build time | 2+ weeks |
| Team size | 2 (Team Lead + Co-Creator) |

---

**Agropioo** — Because every farmer deserves a smart advisor, in their own language, for free.

*Built with ❤ for Pakistan's 40 million farming families.*
