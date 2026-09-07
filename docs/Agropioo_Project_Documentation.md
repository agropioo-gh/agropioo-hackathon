# Agropioo — Project Documentation

## Project Overview

**Project Name:** Agropioo  
**Category:** Smart Agriculture  
**Initial Market:** Pakistan  

**Built by:** Sheikh Mohammad Ahmed (Team Lead) & Mustafa Shahzad (Co-Creator) · Aplinode  
**Hackathon:** AI Hackathon Pakistan 2026  

Agropioo is an AI-powered smart agriculture platform designed initially for Pakistan to help farmers make informed decisions throughout the complete crop lifecycle. It combines a multi-agent AI Agriculture Advisor, digital farm records, weather-aware recommendations, crop disease detection, mandi price tracking, crop recommendations, pest outbreak predictions, profit/loss tracking, and full local-language accessibility.

The long-term vision is to scale globally by adapting the platform to local crops, climates, agricultural practices, and languages.

## 1. Problem Statement

Farmers often depend on traditional knowledge, local advice, fragmented information, and manual records when making important farming decisions. This can make it difficult to know the right time for irrigation, fertiliser or pesticide application, disease management, planting, and harvesting.

Important farm history may also be lost because activities are recorded informally or not recorded at all. Market prices are hard to track across mandis, and government schemes are difficult to discover and navigate.

## 2. Proposed Solution

Agropioo provides a central digital platform where farmers can maintain farm information and receive personalised AI-powered agricultural guidance. The platform combines:

- A **multi-agent AI Advisor** with 8 specialized agents that understand crop, location, weather, and farm history
- **Digital farm records** for structured tracking of all farming activities
- **Real-time weather advisories** with farm-specific AI recommendations
- **Crop disease detection** using photo upload and machine learning
- **Mandi price tracking** with live data from 5 government sources and 14-day predictions
- **Crop recommendation engine** with multi-factor scoring
- **Pest outbreak prediction** with risk alerts
- **Profit/loss calculator** with expense tracking and break-even analysis
- **Offline-first PWA** support for unreliable connectivity

## 3. Core Features

### 3.1 Multi-Agent AI Agriculture Advisor

The advisor uses 8 specialized AI agents orchestrated via OpenAI Agents SDK:

| Agent | Responsibility |
|---|---|
| Triage | Routes queries to the right specialist agent |
| Crop Advisor | Crop-specific agricultural guidance |
| Weather Agent | Weather-aware recommendations |
| Prices Agent | Market price guidance and timing |
| Schemes Agent | Government scheme matching |
| Farm Data Agent | Farm history and records queries |
| Crop Recommendation Agent | Seasonal crop suggestions |
| Handoff Agent | Cross-domain queries |

**Capabilities:**

- Irrigation timing and scheduling
- Crop planning and rotation
- Fertiliser and pesticide guidance
- Pest and disease support
- Harvest timing
- Weather-aware recommendations
- Market price guidance
- Government scheme information
- Everyday agriculture questions

**RAG system:** Vector embeddings (pgvector, Ollama nomic-embed-text) over 21 agricultural knowledge documents for grounded responses.

**Conversation memory:** Persistent chat history with conversation summaries.

**Streaming:** Real-time server-sent events for response delivery.

### 3.2 Digital Farm Records

Agropioo maintains a structured history for each farm.

**7 record types:**

- Sowing
- Planting
- Irrigation
- Fertiliser applications
- Pesticide applications
- Disease incidents and recovery
- Harvest information

**Additional tracking:**

- Expenses
- Crop growth stages
- Other farming activities

Records are farm-specific, searchable, and used as context by the AI advisor.

### 3.3 Farm Management

- Farm creation with Leaflet interactive map drawing
- GPS coordinate capture and geocoding
- Farm health score (computed from records, weather, growth stage)
- Growth stage tracking
- Weather snapshot per farm
- Farm archiving and restoration

### 3.4 AI Crop Disease Detection

- Photo upload → TensorFlow.js local classification → HuggingFace model refinement
- Cloudinary image storage and optimisation
- Diagnosis cards with severity, confidence score, and treatment recommendations
- Follow-up chat per scan for deeper diagnosis
- Scan history tracking

### 3.5 Mandi Price Tracker

**Live data from 5 government sources:**

| Source | Coverage |
|---|---|
| AMIS (amis.pk) | National commodity prices |
| SAMIS (samis.pk) | Sindh agricultural prices |
| FMIS KP (fmis.kp.gov.pk) | Khyber Pakhtunkhwa prices |
| BMIS | Balochistan prices |
| PBS-SPI | Consumer price index |

**Features:**

- Price history charts
- 14-day price predictions with statistical model
- SELL/HOLD recommendation signals
- Market comparison across mandis
- Global mandi search
- Crop favourites
- Price alerts
- Automated daily ingestion via cron

### 3.6 Weather Advisory

**Data source:** OpenWeather 5-day / 3-hour forecast (free tier)

**Features:**

- Farm-specific AI advisories based on crop type and growth stage
- Alert system (frost, rain, heat warnings)
- Growth stage computation from planting dates
- Daily alerts via cron
- Advisory history with acknowledgement
- Hourly and weekly forecast charts

### 3.7 Crop Recommendation Engine

- Multi-factor scoring: soil type, season, budget, irrigation availability, market conditions
- 40+ crop catalogue
- 16 district soil profiles (Pakistan)
- Crop rotation rules
- Comparison charts
- Save and revisit recommendations

### 3.8 Pest Outbreak Prediction

- Daily risk scores via cron job
- Growth-stage-aware predictions
- Forecast charts
- Pest alerts with notifications
- Growth stage editor
- History tracking

### 3.9 Profit/Loss Calculator

- Season tracking (create, view, archive, restore)
- Expense CRUD (categories, amounts, dates)
- Projected costs
- Break-even analysis
- ROI calculation
- Charts: expense breakdown, expense time series, break-even bar

### 3.10 App-Control Chat Agent

- Floating chat accessible on every page
- 12 tools: create/update/delete records, navigate, weather/prices/P&L summaries, handoff to advisor
- Page-aware context (knows which page user is on)
- Streaming responses

### 3.11 Offline-First PWA

- Serwist service worker for offline caching
- IndexedDB write queue for offline data entry
- Drain-on-reconnect for queued operations
- Client UUIDs for idempotency
- Offline install prompt

### 3.12 Notifications Centre

- Weather alert notifications
- Pest outbreak alert notifications
- Price spike alert notifications
- Read/dismiss tracking

### 3.13 Email System

- Nodemailer + SMTP for OTP verification, password reset, notifications
- Demo mode fallback when SMTP is unconfigured

## 4. Local Language Accessibility

The Pakistan-first platform supports 8 languages with database-stored translations:

| Priority | Language | Speakers | Region |
|---|---|---|---|
| — | English | — | Default UI language |
| 1 | Urdu | ~9% | National language, nationwide |
| 2 | Punjabi | ~37% | Dominant in Punjab |
| 3 | Pashto | ~18% | Dominant in Khyber Pakhtunkhwa |
| 4 | Sindhi | ~14% | Dominant in Sindh |
| 5 | Saraiki | ~12% | Southern Punjab |
| 6 | Balochi | ~3% | Dominant in Balochistan |
| 7 | Hindko | ~2% | Hazara, northern Punjab |

**Features:**

- Visible language switcher in nav (public pages, signup, login, inside farmer app)
- Language chosen before/during signup carries into onboarding
- URL-based locale routing (`/[locale]/`)
- RTL support for Urdu and Pashto with mirrored layout
- Nastaliq typography for Urdu
- Translations managed in Neon `translations` table (admin-editable, not hardcoded)

## 5. Pakistan-First Approach

The first version focuses on Pakistan's agricultural environment, local farming practices, crops, regional languages, and local conditions:

- 16 district soil profiles for crop recommendations
- 5 government price data sources (AMIS, SAMIS, FMIS-KP, BMIS, PBS-SPI)
- Pakistan-specific crop catalogue (40+ crops)
- Growth stage models for local crops
- Local weather advisory patterns
- Government scheme matching

The product can be refined through real farmer feedback and local use cases before expanding into additional markets.

## 6. Global Expansion Vision

Agropioo is designed to become a globally adaptable platform by supporting:

- Additional countries and regions
- Local languages and RTL layouts
- Local crops and growth models
- Climate conditions and weather data
- Agricultural knowledge bases
- Regional farming practices and market data

## 7. Target Users

### Individual Farmers

Farmers who need practical personalised assistance and organised farm records.

### Commercial Farms and Agricultural Businesses

Organisations that need structured farm information and decision support.

### Future Agricultural Ecosystem Partners

Future partners within the wider agricultural ecosystem.

## 8. Key Value Proposition

Agropioo brings personalised AI guidance and organised farm intelligence into one accessible platform.

It helps farmers:

- Understand **what to do**
- Understand **when to do it**
- Maintain a useful history of **what has already been done**
- Know **what to sell and when** (price predictions)
- Know **what to plant** (crop recommendations)
- Know **what risks are coming** (pest and weather alerts)
- Know **how their farm is performing financially** (P&L tracking)

## 9. Product Vision

The vision of Agropioo is to make intelligent agricultural guidance accessible to farmers regardless of their technical background or language.

Starting with Pakistan and expanding globally, Agropioo aims to become a trusted AI-powered farming platform that helps farmers:

- Make better decisions
- Improve productivity
- Reduce avoidable losses
- Manage their farms more effectively
- Track and improve profitability

## 10. Example Farmer Journey

### Step 1 — Sign Up & Onboard

The farmer creates an account, verifies via OTP, selects their preferred language (one of 8), and is guided through onboarding.

### Step 2 — Add Farm

The farmer draws their farm boundary on an interactive Leaflet map, enters location, crop, and basic information. GPS coordinates are captured automatically.

### Step 3 — Ask the AI

The farmer asks a farming question in their preferred language. The multi-agent system routes to the right specialist and provides grounded advice using farm data, weather, and agricultural knowledge.

### Step 4 — Record Activity

The farmer logs field events: sowing, irrigation, fertiliser, pesticide application, disease incidents, harvest — all timestamped and farm-specific.

### Step 5 — Track Prices

The farmer monitors live mandi prices from 5 government sources, views 14-day predictions, and gets SELL/HOLD signals for their crops.

### Step 6 — Check Weather

The farmer receives farm-specific weather advisories based on their crop type and growth stage, with alerts for frost, rain, and heat.

### Step 7 — Get Crop Recommendations

The farmer uses the recommendation engine to discover what to plant this season, scored against soil, climate, budget, and market conditions.

### Step 8 — Monitor Pest Risks

The farmer receives daily pest outbreak risk scores and alerts based on weather patterns and growth stages.

### Step 9 — Track Finances

The farmer creates a season, logs expenses, and monitors break-even analysis and ROI via charts.

### Step 10 — Build History

Agropioo stores all farm data for future recommendations and tracking, improving advice quality over time.

## 11. Technical Architecture

**Stack:** Next.js 16 + React 19 + Tailwind CSS v4 + Neon Lakebase Postgres

**Key components:**

- 66 API route handlers across 14 domains
- 85+ React components
- 100+ library modules
- 16 database migrations (pgvector for RAG)
- 35+ test files
- Multi-agent AI system (OpenAI Agents SDK)
- ML inference (TensorFlow.js)
- 5 government price scrapers
- Offline-first PWA (Serwist)

**No separate Express.js backend.** Next.js handles everything.

## 12. Future Expansion

Planned future expansion includes:

- Additional languages and country-specific agricultural knowledge
- Broader crop and regional support
- Deeper integrations with agricultural data sources and services
- More advanced farm analytics and personalised recommendations
- Voice input/output for the advisor (deferred)
- Expert/agronomist role
- Community forum
- SMS alerts
- Expansion from a Pakistan-first product into a global agricultural technology platform

---

## Product Summary

Agropioo is a Pakistan-first AI-powered smart agriculture platform that combines a multi-agent AI advisor, digital farm records, crop disease detection, mandi price tracking with predictions, weather advisories, crop recommendations, pest predictions, profit/loss tracking, and offline-first PWA support.

Its core experience connects the farmer's **farm information, crop, location, weather, market prices, agricultural history, and questions** with practical AI-powered recommendations.

The platform is intended to evolve from a Pakistan-focused solution into a globally adaptable agricultural technology platform.
