/* Thin DB helpers for the voice-ui feature (FR-8): voice_conversations +
   voice_messages tables. All access is scoped per accountId. */

import { query, queryOne } from "@/lib/db";

export type VoiceConversation = {
  id: string;
  account_id: string;
  title: string;
  language: string;
  summary: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VoiceMessage = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  transcript: string | null;
  detected_language: string | null;
  audio_url: string | null;
  tool_invocations: Array<Record<string, unknown>>;
  page_context: Record<string, unknown> | null;
  created_at: string;
};

export async function listVoiceConversations(accountId: string): Promise<VoiceConversation[]> {
  return query<VoiceConversation>(
    `SELECT id, account_id, title, language, summary, started_at, ended_at, created_at, updated_at
     FROM voice_conversations
     WHERE account_id = $1
     ORDER BY updated_at DESC`,
    [accountId],
  );
}

export async function getVoiceConversation(
  conversationId: string,
  accountId: string,
): Promise<VoiceConversation | null> {
  return queryOne<VoiceConversation>(
    `SELECT id, account_id, title, language, summary, started_at, ended_at, created_at, updated_at
     FROM voice_conversations
     WHERE id = $1 AND account_id = $2`,
    [conversationId, accountId],
  );
}

export async function createVoiceConversation(
  accountId: string,
  title: string,
  language: string,
): Promise<VoiceConversation | null> {
  return queryOne<VoiceConversation>(
    `INSERT INTO voice_conversations (account_id, title, language)
     VALUES ($1, $2, $3)
     RETURNING id, account_id, title, language, summary, started_at, ended_at, created_at, updated_at`,
    [accountId, title.slice(0, 80), language],
  );
}

export async function renameVoiceConversation(
  conversationId: string,
  accountId: string,
  title: string,
): Promise<VoiceConversation | null> {
  return queryOne<VoiceConversation>(
    `UPDATE voice_conversations
     SET title = $1, updated_at = now()
     WHERE id = $2 AND account_id = $3
     RETURNING id, account_id, title, language, summary, started_at, ended_at, created_at, updated_at`,
    [title.slice(0, 80), conversationId, accountId],
  );
}

export async function deleteVoiceConversation(
  conversationId: string,
  accountId: string,
): Promise<void> {
  await query(
    `DELETE FROM voice_conversations WHERE id = $1 AND account_id = $2`,
    [conversationId, accountId],
  );
}

export async function touchVoiceConversation(conversationId: string): Promise<void> {
  await query(
    `UPDATE voice_conversations SET updated_at = now() WHERE id = $1`,
    [conversationId],
  );
}

export async function listVoiceMessages(conversationId: string): Promise<VoiceMessage[]> {
  return query<VoiceMessage>(
    `SELECT id, conversation_id, role, transcript, detected_language, audio_url,
            tool_invocations, page_context, created_at
     FROM voice_messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId],
  );
}

export async function insertVoiceMessage(params: {
  conversationId: string;
  role: "user" | "assistant" | "system";
  transcript?: string | null;
  detectedLanguage?: string | null;
  audioUrl?: string | null;
  toolInvocations?: Array<Record<string, unknown>>;
  pageContext?: Record<string, unknown> | null;
}): Promise<void> {
  await query(
    `INSERT INTO voice_messages
       (conversation_id, role, transcript, detected_language, audio_url, tool_invocations, page_context)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)`,
    [
      params.conversationId,
      params.role,
      params.transcript ?? null,
      params.detectedLanguage ?? null,
      params.audioUrl ?? null,
      JSON.stringify(params.toolInvocations ?? []),
      params.pageContext ? JSON.stringify(params.pageContext) : null,
    ],
  );
}