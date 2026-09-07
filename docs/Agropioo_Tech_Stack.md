# Agropioo — Tech Stack

## Project Architecture

Agropioo uses a **full-stack Next.js architecture**. There is **no separate Node.js + Express.js backend**.

Next.js handles:

- Frontend/UI (React 19 Server Components by default)
- Backend/server-side logic (Route Handlers)
- API endpoints (65+ route handlers across 14 domains)
- Authentication logic
- Email operations
- Database communication
- AI agent orchestration
- Cron job endpoints

Neon Lakebase Postgres is the PostgreSQL database (with pgvector for vector embeddings).

---

## 1. Core Framework

### Next.js 16 + React 19

**Purpose:**

- Frontend development (React Server Components by default, `"use client"` at smallest interactive boundary)
- Server-side backend logic
- Route Handlers as the API layer (no Express.js)
- Server-side operations
- Integration with external services

**Architecture:**

```text
Next.js Application
│
├── Frontend (React Server Components)
│   ├── Marketing Pages (locale-prefixed /[locale]/)
│   ├── Farmer App ((farmer) route group)
│   │   ├── Dashboard ((dashboard) sub-group)
│   │   ├── Farm Management
│   │   ├── AI Advisor
│   │   ├── Disease Detection
│   │   ├── Price Tracker
│   │   ├── Weather Advisory
│   │   ├── Crop Recommendations
│   │   ├── Pest Predictions
│   │   ├── Profit/Loss Calculator
│   │   └── Settings & Notifications
│   └── Components (85+ components)
│
└── Backend (Route Handlers)
    ├── Authentication (signup, login, OTP, forgot/reset password)
    ├── AI Agent System (8 specialized agents via @openai/agents)
    ├── Disease Detection (TensorFlow.js + HuggingFace)
    ├── Price Scraping (5 government sources)
    ├── Weather Advisory (OpenWeather API)
    ├── Crop Recommendation Engine
    ├── Pest Outbreak Prediction
    ├── Profit/Loss Calculator
    ├── Email Operations (Nodemailer + SMTP)
    ├── Cron Jobs (price prediction, pest prediction, weather alerts)
    └── Database Operations (Neon Lakebase Postgres)
```

---

## 2. Frontend

### React 19 + Next.js 16

Handles:

- Marketing pages (landing, features, how-it-works, why-agropioo, vision)
- Authentication pages (signup, login, forgot-password, reset-password, OTP verification)
- Farmer dashboard with farm cards, weather widget, price widget, pest risk
- Farm management with Leaflet interactive map drawing
- AI advisor chat with streaming markdown responses
- Disease detection with photo upload and diagnosis cards
- Mandi price tracker with charts and market comparison
- Weather advisory dashboard with forecast charts
- Crop recommendation with comparison charts
- Pest outbreak prediction with forecast charts
- Profit/loss calculator with expense tracking and charts
- Offline-first PWA with service worker

### Tailwind CSS v4

- Styling and responsive design
- Design system with brand tokens (`--color-agro-*`)
- Consistent visual language across all features

### Leaflet Maps

**Packages:** `leaflet`, `react-leaflet`, `@geoman-io/leaflet-geoman-free`

- Interactive map for farm location drawing
- GPS coordinate capture
- Geocoding via Photon API

### PWA / Offline Support

**Package:** `@serwist/next`

- Service worker for offline caching
- IndexedDB write queue for offline data entry
- Drain-on-reconnect for queued operations
- Client UUIDs for idempotency
- Offline install prompt

### Markdown Rendering

**Packages:** `react-markdown`, `remark-gfm`

- AI advisor streaming responses
- GitHub-flavored markdown support

---

## 3. Backend

### Next.js Route Handlers (65+ endpoints)

The backend API layer is organized into 14 domains:

```text
app/api/
├── auth/
│   ├── signup/ (+ verify, resend)
│   ├── login/
│   ├── logout/
│   ├── forgot-password/
│   └── reset/ (+ password, verify, resend)
│
├── advisor/
│   ├── chat (streaming)
│   ├── conversations
│   ├── conversations/[id]
│   └── messages/[conversationId]
│
├── app-control/
│   ├── chat (streaming)
│   ├── conversations
│   ├── conversations/[id]
│   └── messages/[conversationId]
│
├── detect/
│   ├── (upload)
│   ├── save
│   ├── history
│   ├── scans/[scanId]
│   ├── chats
│   ├── chats/[chatId]
│   ├── messages/[chatId]
│   └── chat
│
├── farms/
│   ├── (list/create)
│   ├── [id] (+ archive, restore)
│   └── [id]/records
│
├── records/
│   ├── (list/create)
│   └── [id]
│
├── crops/
│   ├── (recommend)
│   ├── catalogue
│   ├── save
│   ├── saved
│   └── [request_id]
│
├── prices/
│   ├── (list)
│   ├── ingest
│   ├── predictions
│   ├── history
│   ├── alerts
│   └── health
│
├── weather/
│   ├── current
│   ├── forecast
│   ├── register
│   ├── history
│   ├── history/[id]/acknowledge
│   ├── alerts
│   ├── alerts/[id]/read
│   └── alerts/trigger (cron)
│
├── pest/
│   ├── forecast
│   ├── growth-stage
│   ├── alerts
│   └── alerts/[id]/read
│
├── profit-loss/
│   ├── (list/create)
│   ├── [id]
│   ├── [id]/expenses (+ [expenseId])
│   ├── [id]/projected-costs
│   └── [id]/ (+ archive, restore)
│
├── favourites/
├── cron/
│   ├── predict-prices
│   └── pest-prediction
└── health/
```

Backend handles:

- Authentication & authorization (JWT httpOnly cookies, session guards)
- Password hashing (bcryptjs)
- Rate limiting (per-IP on auth routes)
- Multi-agent AI orchestration (8 specialized agents)
- Disease detection pipeline (TensorFlow.js + HuggingFace + Cloudinary)
- Price scraping from 5 government sources
- Price prediction forecasting
- Weather advisory generation (OpenWeather + AI)
- Pest outbreak risk scoring
- Crop recommendation scoring (multi-factor)
- Financial calculations (P&L, break-even, ROI)
- Email sending (Nodemailer + SMTP)
- Vector embeddings (pgvector + Ollama)
- Cron job endpoints (price prediction, pest prediction, weather alerts)
- Offline data sync with idempotency

---

## 4. Database

### Neon Lakebase Postgres

**Client:** `pg` (connection pool with retry logic)

**Features used:**

- Tables with relationships and foreign keys
- SQL queries (parameterized, no raw interpolation)
- pgvector extension for vector embeddings (RAG knowledge base)
- Translations table for 8-language i18n

**Shared client module:** `lib/db.ts` — all route handlers import from it. No ad-hoc clients.

**Architecture rule:** All DB access flows through Next.js Route Handlers → Neon Lakebase Postgres (never client-to-DB directly).

**Migration files:** 16 migrations in `db/migrations/`:

| Migration | Purpose |
|---|---|
| 0001 | Translations table (8 languages) |
| 0002 | Auth: users, sessions, OTP codes |
| 0003 | Advisor conversations + messages |
| 0003 | Farms + farm records |
| 0004 | Advisor conversation summaries |
| 0005 | Disease detection scans |
| 0006 | pgvector embeddings for RAG |
| 0007 | Detect follow-up chats |
| 0008 | Mandi prices + crops + mandis |
| 0008 | Weather advisories + alerts |
| 0009 | Crop recommendation requests |
| 0010 | Scraper audit logs |
| 0011 | Crop data enhancements |
| 0012 | Embedding model upgrade |
| 0013 | Price predictions cache |
| 0014 | Profit/loss: seasons, expenses, projected costs |
| 0015 | Client UUIDs for offline idempotency |
| 0015 | Pest predictions + alerts |
| 0016 | App-control conversations |

---

## 5. Authentication

### Custom Authentication (server-side)

**Password Hashing:** `bcryptjs` — hash during signup, compare during login, never store plaintext.

**JWT Sessions:** `jose` — generate/verify JWT tokens, httpOnly/Secure/SameSite cookies, unreadable from client JS.

**OTP Verification:** Custom code-flow with email delivery (Nodemailer) + demo-mode fallback.

**Rate Limiting:** Per-IP rate limiting on auth routes (signup, login, forgot-password).

**Session Guards:** Server-side guard functions protect authenticated routes.

**Flow:**

```text
User Password
      ↓
bcryptjs Hashing
      ↓
Neon Lakebase Postgres (stored hash)
      ↓
Login → bcryptjs compare → jose JWT sign → httpOnly cookie
      ↓
Protected Route → jose JWT verify → session guard → handler
```

---

## 6. AI / ML Pipeline

### Multi-Agent AI Advisor

**Packages:** `openai` (LLM client), `@openai/agents` (orchestration)

8 specialized agents with automatic handoff:

| Agent | Responsibility |
|---|---|
| Triage | Routes queries to the right specialist |
| Crop Advisor | Crop-specific guidance |
| Weather Agent | Weather-aware recommendations |
| Prices Agent | Market price guidance |
| Schemes Agent | Government scheme matching |
| Farm Data Agent | Farm history and records |
| Crop Recommendation Agent | Seasonal crop suggestions |
| Handoff Agent | Cross-domain queries |

**RAG system:** pgvector embeddings over 21 knowledge documents, generated locally via Ollama (`nomic-embed-text`, 768 dimensions).

**Streaming:** Server-sent events for real-time response delivery.

### AI Crop Disease Detection

**Packages:** `@tensorflow/tfjs` (local ML inference), `@tensorflow/tfjs-core`

- Photo upload → TensorFlow.js classification → HuggingFace model refinement
- Cloudinary for image storage
- Diagnosis cards with severity, confidence, treatment recommendations
- Follow-up chat per scan

### Price Prediction

- 14-day forecasts via statistical model
- Cron job for daily prediction updates
- SELL/HOLD recommendation signals

### Weather Advisory

**API:** OpenWeather 5-day / 3-hour forecast

- Farm-specific AI advisories based on crop + growth stage
- Alert system (frost, rain, heat warnings)
- Growth stage computation from planting dates

### Pest Outbreak Prediction

- Daily risk scores via cron job
- Growth-stage-aware predictions
- Alert notifications

---

## 7. External Services

### Price Data Sources (5 government scrapers)

| Source | URL | Coverage |
|---|---|---|
| AMIS | amis.pk | National commodity prices |
| SAMIS | samis.pk | Sindh agricultural prices |
| FMIS KP | fmis.kp.gov.pk | Khyber Pakhtunkhwa prices |
| BMIS | bmis | Balochistan prices |
| PBS-SPI | pbs-spi | Consumer price index |

### Image Storage

**Package:** `cloudinary` — scan image hosting and optimization.

### Geocoding

**API:** Photon — reverse geocoding for farm locations.

### Email Delivery

**Package:** `nodemailer` + SMTP provider — OTP, verification, password reset, notifications.

---

## 8. Validation

### Zod

- Request validation on every route handler input (query params + body)
- Form data validation
- API input validation
- Preventing invalid data from reaching the database

**Validation schemas:** Organized in `lib/validation/` with dedicated files for auth, farms, crops, detect, pest, profit-loss, weather, advisor, and app-control.

### React Hook Form + @hookform/resolvers

- Client-side form management
- Zod resolver integration for type-safe validation

---

## 9. Environment Variables

All secrets in env vars, read server-side only. Never committed, never logged.

```env
# Database
DATABASE_URL=
DATABASE_URL_UNPOOLED=

# Auth
JWT_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

# Demo mode (verification-code banner when SMTP unconfigured)
DEMO_MODE=

# AI Advisor (OpenAI-compatible API)
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
ADVISOR_MODEL=gpt-4o-mini

# Weather
OPENWEATHER_API_KEY=

# Knowledge-base embeddings (local Ollama)
OLLAMA_HOST=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text

# Disease detection
HUGGINGFACE_API_KEY=

# Image storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Cron job secrets
PRICES_CRON_SECRET=
CRON_SECRET=
PEST_CRON_SECRET=
ADVISOR_CRON_SECRET=
```

---

## 10. Required npm Packages

### Runtime Dependencies

```bash
npm install next react react-dom pg zod react-hook-form @hookform/resolvers bcryptjs jose nodemailer openai @openai/agents cloudinary @tensorflow/tfjs @tensorflow/tfjs-core leaflet react-leaflet @geoman-io/leaflet-geoman-free @serwist/next react-markdown remark-gfm
```

### Dev Dependencies

```bash
npm install -D typescript @types/node @types/react @types/react-dom @types/pg @types/bcryptjs @types/jose @types/nodemailer @types/leaflet tailwindcss eslint vitest playwright xlsx
```

---

## 11. Final Architecture

```text
                              USER
                                │
                                ▼
                     Next.js Frontend (React 19)
                     ┌──────────┼──────────┐
                     │          │          │
                     ▼          ▼          ▼
              Marketing    Farmer App   PWA/Offline
              Pages        (Dashboard)  (Serwist)
                     │          │          │
                     └──────────┼──────────┘
                                │
                                ▼
                 Next.js Server-side Layer (Route Handlers)
        ┌──────────┬──────────┬──────────┬──────────┐
        │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼
    Auth        AI Agents  Scrapers   Weather   Cron Jobs
    (bcryptjs   (openai +  (5 gov     (Open     (prices,
     + jose)    agents)    sources)   Weather)  pest, weather)
        │          │          │          │          │
        └──────────┼──────────┼──────────┼──────────┘
                   │          │          │
                   ▼          ▼          ▼
             Neon Lakebase Postgres (pgvector)
             + Cloudinary (images)
             + Ollama (embeddings)
```

---

## 12. Testing

- **35 test files** across validation, auth, crops, prices, scrapers, farms, advisor agents, API routes
- **Framework:** Vitest for unit/integration tests
- **Playwright** available for E2E tests
- Validation schemas have dedicated test coverage
- Scraper tests for all 5 government sources

---

## Tech Stack Summary

| Category | Technology |
|---|---|
| Full-Stack Framework | Next.js 16 |
| Frontend | React 19 (Server Components) |
| Styling | Tailwind CSS v4 |
| Maps | Leaflet + React-Leaflet |
| PWA/Offline | Serwist (service worker) |
| Markdown | react-markdown + remark-gfm |
| Backend/API | Next.js Route Handlers (65+ endpoints) |
| Database | Neon Lakebase Postgres |
| Database Client | pg (pooled) |
| Vector Embeddings | pgvector + Ollama |
| Password Hashing | bcryptjs |
| JWT Authentication | jose (httpOnly cookies) |
| AI Orchestration | OpenAI SDK + @openai/agents (8 agents) |
| ML Inference | TensorFlow.js |
| Image Storage | Cloudinary |
| Email Library | Nodemailer + SMTP |
| Price Data | 5 government scrapers (AMIS, SAMIS, FMIS-KP, BMIS, PBS-SPI) |
| Weather Data | OpenWeather API |
| Validation | Zod |
| Forms | React Hook Form + @hookform/resolvers |
| Testing | Vitest + Playwright |
| Geocoding | Photon API |
