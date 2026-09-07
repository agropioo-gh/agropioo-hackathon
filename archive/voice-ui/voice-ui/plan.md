# Voice-Enabled UI — Implementation Plan

> `/api/voice/*` + a global floating voice overlay in the farmer app shell. Mirrors the advisor & app-control chat architecture (OpenAI Agents SDK + streaming SSE + dedicated conversation tables) but with an audio front-end: `MediaRecorder` → server-side Whisper STT → agent → `speechSynthesis` TTS in the browser.

---

## Context

The existing demo has text-only advisor + app-control chat. The voice-ui spec adds a third interaction modality: the farmer taps a floating mic on any dashboard page, speaks in their language, and a dedicated voice agent performs the same app-wide actions as app-control (read data, create/update/delete records, navigate, answer questions) and replies aloud. The spec was cleaned up (duplicate FR-17/18/19 renumbered to FR-20/21/22/23) before this plan was written.

Two hard constraints from the spec and the constitution:
- **FR-3:** TTS uses browser-native `speechSynthesis` only. No server-side TTS API.
- **FR-2:** STT is server-side, Whisper-compatible (reuses the existing `OPENAI_BASE_URL` / `OPENAI_API_KEY` provider from `lib/llm-provider.ts`), auto-detects language across all 8 locales.
- **FR-16:** Two dedicated route handlers — `POST /api/voice/stt` and `POST /api/voice/action` — both guarded by `requireSessionApi()` and the existing rate limiter.
- **FR-17:** Single client overlay mounted in `app/(farmer)/(dashboard)/layout.tsx`, persists across pages.

The voice agent reuses the OpenAI Agents SDK runner already wired through `lib/llm-provider.ts`. Voice-specific tools wrap the existing app-control tool surface (same execution, same scoping), so write actions stay authorised through the existing route handlers. Voice, advisor, and app-control keep **separate** conversation tables per FR-8, but share summaries so the agent has cross-modality memory.

---

## Architecture

```
Farmer app page (any /dashboard/* route)
  └─ VoiceOverlay (mounted once in dashboard layout)
       ├─ MicButton + WaveformAnimation (idle / listening / processing / speaking)
       ├─ VoiceStatusPanel (status text, stop button, transcript preview)
       └─ VoiceSidebar (conversation list, separate from advisor & app-control)

Browser MediaRecorder → WebM/Opus blob
  └─ POST /api/voice/stt  ─→  Whisper (OpenAI-compatible, OPENAI_BASE_URL)
       └─ returns { text, language }

POST /api/voice/action  (transcribed text + page context + conversationId)
  └─ requireSessionApi + hitLimiter("voiceActionIp" / "voiceActionAccount")
  └─ OpenAI Agents SDK (lib/llm-provider.ts) → voice triage agent
       ├─ tools (Zod-validated; reuse app-control tool implementations where possible)
       │    ├─ getFarmSummary / getFarmDetails / getRecentRecords
       │    ├─ getWeatherSummary  / getPriceSummary  / getProfitLossSummary
       │    ├─ createRecord / updateRecord / deleteRecord   (write → confirm-via-voice loop)
       │    ├─ navigateToPage  (allowlist; announces on success)
       │    └─ handoffToAdvisor (general farming questions → advisor page)
       ├─ FR-5/FR-20 spoken status updates streamed as SSE events
       └─ returns final { replyText, replyLanguage, actions[], navigateTo? }

Client streams SSE → renders transcript + runs speechSynthesis(lang, replyText)
```

### Why this shape

- **Two routes, not one.** Audio upload (multipart, large) and agent invocation (JSON, small, streaming) have different shapes, different rate-limit cadences, and different failure modes. Splitting them keeps each handler small and aligns with the spec (FR-16).
- **Reuse app-control tools.** All app-control tool functions live in `lib/app-control/tools/*` and accept a session context. We import them directly rather than duplicating. Write tools gain a `requiresVoiceConfirm: true` flag the voice agent honours (FR-18/19). Read tools do not.
- **No new LLM SDK.** The Agents SDK runner in `lib/llm-provider.ts` is model-agnostic via `OPENAI_BASE_URL`. Whisper STT goes through the same `OPENAI_BASE_URL` endpoint as chat completions, so the existing env vars cover it.
- **Browser TTS only.** `speechSynthesis` is free, on-device, and supports the languages we already ship (the browser may fall back to "no voice" for less-supported locales; FR-3 mandates the agent still displays text).

---

## Database (Migration `0017_voice.sql`)

```sql
-- Voice conversations, separate from advisor / app-control (FR-8)
CREATE TABLE voice_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New voice session',
  language text NOT NULL DEFAULT 'en',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX voice_conversations_account_idx ON voice_conversations(account_id, updated_at DESC);

CREATE TABLE voice_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES voice_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  transcript text,                     -- user: STT text ; assistant: TTS-ready reply
  detected_language text,              -- Whisper-detected language code
  audio_url text,                      -- user: uploaded audio in Cloudinary; null for assistant/system
  tool_invocations jsonb NOT NULL DEFAULT '[]'::jsonb,
  page_context jsonb,                  -- currentPath + pageState at time of utterance
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX voice_messages_conv_idx ON voice_messages(conversation_id, created_at);

-- Cross-modality memory (FR-8: agent has access to summaries of all prior conversations)
-- This piggybacks on the existing conversation_summaries table populated by the
-- advisor & app-control flows; voice just writes its own rows.
```

Storage choice: existing migrations use Cloudinary for user attachments; reuse it for `voice_messages.audio_url`. Add `voice/user_<id>/` folder. **No new storage dependency.**

---

## File layout (new)

```
app/api/voice/
  stt/route.ts                        POST — multipart audio upload → Whisper
  action/route.ts                     POST — transcribed text + context → agent SSE
  conversations/route.ts              GET list, POST rename
  conversations/[id]/route.ts         GET messages, DELETE conversation

app/(farmer)/(dashboard)/voice/
  page.tsx                            Optional full-page voice history (sidebar also lives here)

components/voice/
  voice-overlay.tsx                   "use client" — global mount in dashboard layout
  voice-bundle.ts                     i18n bundle loader (parallels app-control-bundle)
  voice-mic-button.tsx                Mic + waveform (idle / listening / processing / speaking)
  voice-status-panel.tsx              Status text + stop button + transcript preview
  voice-sidebar.tsx                   Conversation list, rename, delete
  voice-conversation-view.tsx         Transcript reader (read-only)

lib/voice/
  stt.ts                              Whisper client (uses OPENAI_BASE_URL/OPENAI_API_KEY)
  agent.ts                            Voice triage agent factory (parallels lib/app-control/agent.ts)
  streaming.ts                        SSE helpers for the agent action route
  page-context.tsx                    React context for current page path/state (reuses app-control's)
  tools/                              Re-exports + voice wrappers around lib/app-control/tools/*
    index.ts
    write-confirm.ts                  Wraps create/update/delete with confirm-via-voice state
    navigate.ts                       Allowlist + announcement message

lib/validation/voice.ts               Zod schemas (sttUploadSchema, voiceActionSchema, voiceConversationSchema)

db/migrations/0017_voice.sql          Schema above

scripts/sync-translations.mts         Updated to include the new voice.* translation keys for all 8 locales
```

No deletions, no renames. Additive only.

---

## Phased task breakdown

Each task is one atomic commit. Tasks are ordered by dependency; FR coverage noted per task. **Verify is never skipped** — automated where it exists (route-handler unit tests for Zod schemas + STT/agent invocation mocks), manual run-through otherwise.

### Task 1 — Spec cleanup commit (already done)
Renumber FR-17/18/19 second-occurrence → FR-20/21/22/23, fix acceptance-criteria cross-references.
*Output: `specs/voice-ui/spec.md` now has 23 unique FRs.*

### Task 2 — Database migration + db client helpers
- Create `db/migrations/0017_voice.sql` with the schema above.
- Add `lib/voice/conversations.ts` with thin wrappers around `query`/`queryOne` for `voice_conversations` + `voice_messages` (parallels `lib/app-control/conversations.ts`).
- **Verify:** `npm run build` (migration files are loaded by the runtime migration runner); manual Neon MCP `run_sql` on a temporary branch to confirm the schema applies cleanly.

### Task 3 — i18n bundle + translation keys (FR-12)
- Define new keys in `lib/i18n/server.ts` (parallel block to `app.advisor.*` / `app.appControl.*`): `app.voice.*` for mic tooltip, permission states, listening/processing/speaking labels, errors, sidebar, confirmation prompts, follow-up timeout, emergency stop.
- Insert rows for all 8 locales (`en`, `ur`, `pa`, `ps`, `sd`, `skr`, `bal`, `hno`) into the Neon `translations` table via `scripts/sync-translations.mts`.
- **Verify:** `node scripts/sync-translations.mts --dry-run` shows the new keys; `npm run lint` passes.

### Task 4 — Server-side STT route handler (FR-2, FR-14, FR-16)
- `app/api/voice/stt/route.ts`: `POST`, multipart `audio/webm`, max 25 MB.
- Calls `lib/voice/stt.ts` which POSTs the blob to `${OPENAI_BASE_URL}/audio/transcriptions` with `model: whisper-large-v3` (or whichever the provider exposes) and `response_format: verbose_json` so we get the detected language.
- Returns `{ text, language }`. Zod-validates the response before returning.
- Guarded by `requireSessionApi()`. Rate-limited via `hitLimiter("voiceSttIp", ...)` — add new rule `voiceSttIp: { limit: 30, windowMs: HOUR_MS }` (audio uploads cost more than chat).
- **Verify:** Zod test (`lib/voice/stt.test.ts`) with a mocked fetch; manual `curl` upload of a recorded `.webm` confirms round-trip.

### Task 5 — Agent action route handler (FR-1, FR-5, FR-6, FR-15, FR-16, FR-20)
- `app/api/voice/action/route.ts`: `POST`, JSON body, SSE response.
- Body: `{ conversationId?, text, detectedLanguage, pageContext }`.
- Loads `accountId`, builds `FarmerContext` (same as advisor chat), streams agent run.
- Emits SSE events: `status` (FR-20 milestones), `tool_call`, `confirm` (FR-18/19), `navigate`, `final` (reply text + language).
- Rate-limited via `hitLimiter("voiceActionIp", ...)` and `voiceActionAccount: { limit: 60, windowMs: HOUR_MS }`.
- **Verify:** Zod schema tests; manual run-through of one read action ("weather summary") and one write action ("add expense") with a mock agent.

### Task 6 — Voice agent + tools (FR-6, FR-7, FR-15, FR-18, FR-19, FR-22, FR-23)
- `lib/voice/agent.ts` — `createVoiceAgent(ctx)` factory using the OpenAI Agents SDK. Triage agent handoffs to the same specialists as advisor (`crop_disease`, `weather`, `farm_data`, `prices`, `schemes`), plus `app_control` handoff for writes.
- `lib/voice/tools/*` — re-export `getFarmSummary`, `getRecentRecords`, `getWeatherSummary`, `getPriceSummary`, `getProfitLossSummary` from `lib/app-control/tools/*` unchanged. Add voice wrappers for `createRecord`, `updateRecord`, `deleteRecord` that return a `requiresVoiceConfirm` payload (FR-18/19) and a `navigateToPage` tool with an explicit allowlist derived from `app/(farmer)/(dashboard)/*` (FR-7).
- All tools scope by `ctx.accountId` (FR-15). All write tools require explicit confirmation event before the agent finalises.
- Add `handoffToAdvisor` so general farming questions redirect to the advisor page.
- **Verify:** Mocked agent test asserting (a) read tool returns scoped data only, (b) write tool emits confirm event before applying, (c) navigate tool rejects paths outside the allowlist.

### Task 7 — Page context provider reuse (FR-5)
- Voice overlay reads the existing `LayoutWithPageContext` page-context from `lib/app-control/page-context.tsx` rather than introducing a parallel provider.
- Server route receives the same `X-Page-Context` header.
- **Verify:** Manual — speak a query on `/prices` and confirm the agent's response references the current page.

### Task 8 — Conversation API routes (FR-8)
- `app/api/voice/conversations/route.ts` — `GET` list, `POST` rename.
- `app/api/voice/conversations/[id]/route.ts` — `GET` messages, `DELETE` (with confirmation per app-control pattern).
- Each guarded by `requireSessionApi()` and the same rate limiter used by advisor conversation routes.
- **Verify:** Zod schema tests; manual CRUD.

### Task 9 — Global voice overlay (FR-1, FR-4, FR-17, FR-18, FR-21)
- `components/voice/voice-overlay.tsx` — `"use client"`. Mounts `MediaRecorder`, manages `idle | listening | processing | speaking` state machine.
- `voice-mic-button.tsx` — floating bottom-corner button, **separate** from the app-control chat button. Waveform animation via `AnalyserNode` + `<canvas>` (or CSS bars if simpler). Hidden when no microphone hardware (FR-13 edge case).
- Tap-to-start, silence-detected auto-stop (FR-2/FR-4). Tapping while in `speaking` or `processing` is the **emergency stop** (FR-21) — cancels `speechSynthesis`, aborts the fetch, resets state.
- `voice-status-panel.tsx` — sliding panel above the mic with live transcript preview, current status label, and a stop button. Renders RTL for Urdu/Punjabi/Pashto/Sindhi/Saraiki/Balochi/Hindko (FR-12).
- Permission flow (FR-9): first tap triggers `navigator.mediaDevices.getPermissions` / `getUserMedia`. If denied, button becomes inactive with a localised message + a "Open settings" link.
- Offline (FR-13): `navigator.onLine === false` → button visible but inactive, tooltip "Voice unavailable offline".
- **Verify:** Manual run-through covering: idle → tap → listening → silence stop → speaking → emergency stop; denied permission; offline state; RTL layout (Urdu).

### Task 10 — Voice sidebar (FR-8)
- `voice-sidebar.tsx` — list of `voice_conversations` for the current account. Rename + delete actions, parallels `app-control-sidebar.tsx`.
- Tapping a conversation loads its messages into the read-only `voice-conversation-view.tsx` panel.
- **Verify:** Manual — record two sessions, rename one, delete the other, confirm DB state.

### Task 11 — Wire overlay into dashboard layout (FR-17)
- Edit `app/(farmer)/(dashboard)/layout.tsx` to render `<VoiceOverlay />` once at the root, alongside the existing `<AppControlFloatingChat />`. Both overlays are independent windows per the spec.
- Pass `voiceBundle` (loaded via `getShellBundle` analogue — add a `getVoiceBundle` helper in `lib/i18n/server.ts`).
- **Verify:** `npm run build`; manual smoke that overlay survives navigation across `/dashboard`, `/farms`, `/advisor`, `/prices`, `/detect`.

### Task 12 — TTS integration (FR-3, FR-12)
- After every agent `final` event, the overlay calls `speechSynthesis.speak(new SpeechSynthesisUtterance(text))` with `utterance.lang = detectedLanguage` (BCP-47: e.g. `ur-PK`, `pa-IN`, `ps-AF`, `sd-PK`, `skr-PK`, `bal-PK`, `hno-PK`, `en-PK`).
- If `speechSynthesis.getVoices()` returns no voice for that locale, render the text in the status panel but **do not** speak (FR-3 fallback).
- Stop button on the status panel calls `speechSynthesis.cancel()` (FR-3).
- **Verify:** Manual in a Chromium browser with multiple installed voices; verify Urdu voice is picked when available.

### Task 13 — Confirmation flows (FR-18, FR-19, FR-22)
- Write tools emit a `confirm` SSE event carrying the proposed action in plain language (e.g. "I will record a 2000 rupee irrigation expense on your main farm. Say yes to confirm.").
- Overlay opens the mic, listens for the next utterance, and matches "yes / haan / jee / ok / confirm" or "no / nahi / cancel / mat karo". Timeout 30 s (FR-22) → overlay asks the user to continue or cancel, then a further 30 s, then auto-cancels.
- Delete + archive specifically require explicit "yes" (not just "ok") — surfaced by the agent's spoken prompt (FR-19).
- **Verify:** Manual — "add expense" → "yes" → record appears; "delete record" → "no" → record remains; "yes" → record deleted.

### Task 14 — Rate limiting + error fallbacks (FR-10, FR-11)
- Surface localised "please wait" message when `hitLimiter` returns `429`.
- On STT failure: empty text, timeout, provider error → overlay speaks the FR-10 apology in the detected language, offers retry and "switch to text" (which deep-links to `/advisor`).
- On agent failure: same apology, no stack trace, retry button.
- **Verify:** Manual — temporarily set `OPENAI_API_KEY` to invalid, trigger agent call, confirm localised fallback.

### Task 15 — Tests
- Unit: Zod schemas (`voiceUploadSchema`, `voiceActionSchema`, `voiceConversationSchema`).
- Unit: STT route handler with mocked fetch.
- Unit: Agent invocation mock asserting tool calls + confirm flow.
- Unit: Rate-limit bucket counts for `voiceSttIp` / `voiceActionIp` / `voiceActionAccount`.
- Manual run-through checklist (added to `docs/` or an internal testing note) covering every acceptance-criteria bullet that cannot be automated.
- **Verify:** `npm run lint`, `npm run build`, `npm test` all green.

### Task 16 — Acceptance criteria walk-through
- Open every checkbox in `specs/voice-ui/spec.md` only after the corresponding task is verified by code or manual run-through. No checkbox without evidence.

---

## Dependencies

- **New dependency? No.** Whisper STT goes through the existing `OPENAI_BASE_URL` (same provider as chat completions). TTS is browser-native. Audio storage reuses Cloudinary (already used by app-control).
- **Env vars:** none added. Reuse `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `CLOUDINARY_*`.

## Decisions / ADRs

- **STT provider per provider spec.** We use whatever Whisper-compatible model the existing `OPENAI_BASE_URL` exposes (default `whisper-large-v3`). If a future migration swaps providers, this single line changes. Worth a short ADR in `adrs/0017-voice-stt-provider.md`.
- **No new rate-limit dimensions on auth routes.** Voice shares the existing in-process limiter with `voiceSttIp`, `voiceActionIp`, `voiceActionAccount`. If voice traffic becomes the dominant consumer, the next step is Redis (already noted in ADR 0003).

## Out of scope (per spec)

- Voice on marketing site, signup, login, onboarding.
- Always-on listening / wake words.
- Phone-call / IVR / SMS voice.
- On-device STT/TTS.
- Photo upload via voice (camera UI is a separate concern; voice may instruct the farmer to open `/detect`).
- Agronomist voice mode.
- Multi-language single-session switching beyond the per-utterance detection.

## Definition of done

Every checkbox in `specs/voice-ui/spec.md` checked with evidence, all 16 tasks merged to a feature branch in atomic commits, `npm run lint` + `npm run build` green, voice.* translation keys live in the Neon `translations` table for all 8 locales, founder-reviewed, then PR → merge to `main`.
