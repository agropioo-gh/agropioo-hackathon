-- 0017 — Voice UI: separate voice conversations + messages (FR-8).
-- Voice exchanges are persisted in dedicated tables so they can coexist with
-- advisor and app-control chat history. Rows are scoped per farmer via the
-- account_id foreign key (FR-15).

CREATE TABLE IF NOT EXISTS voice_conversations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       text        NOT NULL DEFAULT 'New voice session',
  language    text        NOT NULL DEFAULT 'en',
  summary     text,
  started_at  timestamptz NOT NULL DEFAULT now(),
  ended_at    timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_conv_account_updated
  ON voice_conversations(account_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS voice_messages (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   uuid        NOT NULL REFERENCES voice_conversations(id) ON DELETE CASCADE,
  role              text        NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  transcript        text,
  detected_language text,
  audio_url         text,
  tool_invocations  jsonb       NOT NULL DEFAULT '[]'::jsonb,
  page_context      jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_msg_conv_created
  ON voice_messages(conversation_id, created_at);