# Agropioo — Information Architecture

> Roles, pages, and API routes for the full product. Aligned with `Agropioo_Project_Documentation.md` (Pakistan-first AI agriculture platform) and `Agropioo Tech Stack.md` (Next.js 16 + Neon Lakebase Postgres).

---

## Roles

| Role | Access |
|---|---|
| **Farmer** | Own farms, farm records, AI advisor, all farmer tools |
| **Admin** | User management, content/data management, analytics, price management |

No expert role. No community feature.

---

## Pages

### Marketing & Public — `(site)` route group (locale-prefixed `/[locale]/`)

| Route | Purpose | Status |
|---|---|---|
| `/[locale]` | Landing page with hero, features, solution, problem, farmer journey, CTA | Built |
| `/[locale]/features` | Feature showcase page | Built |
| `/[locale]/how-it-works` | Multi-section how-it-works page | Built |
| `/[locale]/why-agropioo` | Product story page | Built |
| `/[locale]/vision` | Vision and mission page | Built |
| `/[locale]/offline` | Offline fallback page | Built |

### Authentication

| Route | Purpose | Status |
|---|---|---|
| `/signup` | Create account (name, email, password, strength indicator, terms) | Built |
| `/login` | Sign in (email/password, show/hide) | Built |
| `/verify` | OTP email verification (signup + password reset) | Built |
| `/forgot-password` | 3-step password recovery flow | Built |
| `/reset-password` | Set new password via token | Built |
| `/onboarding` | First-login setup: language pick (8 languages), redirect to dashboard | Built |

### Farmer App — `(farmer)/(dashboard)` route group

**Core**

| Route | Purpose | Status |
|---|---|---|
| `/dashboard` | Today's advisory, weather snapshot, mandi prices widget, pest risk widget, quick actions, setup checklist | Built |
| `/farms` | Farm list with health indicators | Built |
| `/farms/new` | Add farm (Leaflet map drawing, GPS, crop, basic info) | Built |
| `/farms/[id]` | Farm detail: records, weather snapshot, growth stage, health overview | Built |
| `/farms/[id]/records` | Farm-specific digital record log | Built |
| `/records/new` | Log field events (7 types: sowing, planting, irrigation, fertilizer, pesticide, disease, harvest) | Built |
| `/advisor` | AI Agriculture Advisor chat — text chat, multi-agent system, streaming, local languages | Built |
| `/favourites` | Crop favourites for quick access | Built |

**Feature Tools**

| Route | Purpose | Status |
|---|---|---|
| `/detect` | AI crop disease detection (photo upload, TensorFlow.js classification, diagnosis history, follow-up chat) | Built |
| `/prices` | Mandi price tracker — live prices from 5 gov sources, charts, market comparison, favorites, alerts | Built |
| `/prices/admin` | Admin price management form | Built |
| `/weather` | Weather dashboard — 5-day forecast, hourly charts, farm-specific AI advisories, alerts | Built |
| `/weather/history` | Weather advisory history list | Built |
| `/weather/history/[id]` | Individual weather advisory detail | Built |
| `/crops` | Crop recommendation engine — multi-factor scoring, comparison charts | Built |
| `/crops/[request_id]` | Individual crop recommendation detail | Built |
| `/profit-loss` | Profit/loss season listing | Built |
| `/profit-loss/new` | Create new season | Built |
| `/profit-loss/[id]` | Season detail with expenses, break-even, charts | Built |
| `/pest` | Pest outbreak prediction — risk scores, forecast charts | Built |
| `/pest/history` | Pest history list | Built |
| `/pest/history/[id]` | Pest prediction detail | Built |
| `/more` | "More tools" index (mobile navigation) | Built |

**Account**

| Route | Purpose | Status |
|---|---|---|
| `/notifications` | Alerts center: weather warnings, pest outbreaks, price spikes | Built |
| `/settings` | Profile, language, notification preferences | Built |

### Admin

| Route | Purpose | Status |
|---|---|---|
| `/prices/admin` | Mandi price management (add/edit prices) | Built |
| `/admin` | KPIs: users, diagnoses run, DAU | Planned |
| `/admin/users` | User management | Planned |
| `/admin/content` | Schemes DB, crop knowledge base, advisory templates | Planned |
| `/admin/analytics` | Impact metrics | Planned |

---

## API Routes

### Authentication

```
app/api/auth/signup/           (POST — create account)
app/api/auth/signup/verify     (POST — verify OTP)
app/api/auth/signup/resend     (POST — resend OTP)
app/api/auth/login             (POST — sign in)
app/api/auth/logout            (POST — sign out)
app/api/auth/forgot-password   (POST — request reset)
app/api/auth/reset/password    (POST — set new password)
app/api/auth/reset/verify      (POST — verify reset token)
app/api/auth/reset/resend      (POST — resend reset OTP)
```

### AI Advisor (Multi-Agent)

```
app/api/advisor/chat                    (POST — streaming chat)
app/api/advisor/conversations           (GET/POST — list/create)
app/api/advisor/conversations/[id]      (GET/DELETE — get/delete conversation)
app/api/advisor/messages/[conversationId] (GET — message history)
```

### App-Control Chat Agent

```
app/api/app-control/chat                    (POST — streaming chat)
app/api/app-control/conversations           (GET/POST — list/create)
app/api/app-control/conversations/[id]      (GET/DELETE — get/delete)
app/api/app-control/messages/[conversationId] (GET — message history)
```

### Disease Detection

```
app/api/detect/                    (POST — upload scan)
app/api/detect/save                (POST — save result)
app/api/detect/history             (GET — scan history)
app/api/detect/scans/[scanId]      (GET — scan detail)
app/api/detect/chats               (GET/POST — follow-up chats)
app/api/detect/chats/[chatId]      (GET/DELETE — chat detail)
app/api/detect/messages/[chatId]   (GET — chat messages)
app/api/detect/chat                (POST — streaming follow-up chat)
```

### Farm Management

```
app/api/farms                      (GET/POST — list/create)
app/api/farms/[id]                 (GET/PUT/DELETE — detail/update/delete)
app/api/farms/[id]/archive         (POST — soft delete)
app/api/farms/[id]/restore         (POST — restore)
app/api/farms/[id]/records         (GET/POST — farm records)
```

### Farm Records

```
app/api/records                    (GET/POST — list/create)
app/api/records/[id]               (GET/PUT/DELETE — detail/update/delete)
```

### Crop Recommendations

```
app/api/crops                      (POST — get recommendations)
app/api/crops/catalogue            (GET — crop catalogue)
app/api/crops/save                 (POST — save recommendation)
app/api/crops/saved                (GET — saved recommendations)
app/api/crops/[request_id]         (GET — recommendation detail)
```

### Mandi Prices

```
app/api/prices                     (GET — list prices)
app/api/prices/ingest              (POST — scraper ingest, cron-authenticated)
app/api/prices/predictions         (GET — price forecasts)
app/api/prices/history             (GET — price history)
app/api/prices/alerts              (GET/POST — price alerts)
app/api/prices/health              (GET — scraper health check)
```

### Weather Advisory

```
app/api/weather/current            (GET — current weather)
app/api/weather/forecast           (GET — 5-day forecast)
app/api/weather/register           (POST — register farm for advisories)
app/api/weather/history            (GET — advisory history)
app/api/weather/history/[id]/acknowledge (POST — acknowledge advisory)
app/api/weather/alerts             (GET — active alerts)
app/api/weather/alerts/[id]/read   (POST — mark alert read)
app/api/weather/alerts/trigger     (POST — cron-triggered alert check)
```

### Pest Prediction

```
app/api/pest/forecast              (GET — pest risk forecast)
app/api/pest/growth-stage          (GET/PUT — growth stage data)
app/api/pest/alerts                (GET — pest alerts)
app/api/pest/alerts/[id]/read      (POST — mark alert read)
```

### Profit/Loss Calculator

```
app/api/profit-loss                (GET/POST — list/create seasons)
app/api/profit-loss/[id]           (GET/PUT/DELETE — season detail)
app/api/profit-loss/[id]/expenses           (GET/POST — expenses)
app/api/profit-loss/[id]/expenses/[expenseId] (PUT/DELETE — expense)
app/api/profit-loss/[id]/projected-costs    (GET/PUT — projected costs)
app/api/profit-loss/[id]/archive            (POST — soft delete)
app/api/profit-loss/[id]/restore            (POST — restore)
```

### Favourites

```
app/api/favourites                 (GET/POST/DELETE — crop favourites)
```

### Cron Jobs

```
app/api/cron/predict-prices        (POST — daily price prediction)
app/api/cron/pest-prediction       (POST — daily pest risk scoring)
```

### Health

```
app/api/health                     (GET — service health check)
```

---

## Database Access Pattern

All DB access flows through Next.js Route Handlers → `lib/db.ts` → Neon Lakebase Postgres. No direct client-to-DB access.

```
Client (React)
      ↓ fetch()
Route Handler (app/api/*)
      ↓ import { query, queryOne } from '@/lib/db'
Neon Lakebase Postgres
```

---

## Build Priority (Hackathon Demo)

1. `/onboarding` — Language selection
2. `/dashboard` — Main hub with widgets
3. `/farms` + records — Farm management
4. `/advisor` — AI chat (multi-agent)
5. `/detect` — Disease detection
6. `/prices` — Mandi price tracker
7. `/weather` — Weather advisory
8. `/crops` — Crop recommendations
9. `/pest` — Pest predictions
10. `/profit-loss` — P&L calculator

---

## Explicitly Out of Scope

- Expert / agronomist role
- Community forum & expert connect
- Voice-first phone call mode (IVR)
- SMS alerts
- Voice input/output (deferred)
- Dark mode
- Satellite/NDVI monitoring (archived)
- Carbon footprint tracker (not built)
- Government schemes page (not built as standalone page; schemes agent handles in-chat)
