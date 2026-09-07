/**
 * OpenAI SDK configuration for OpenAI-compatible providers (e.g. Groq).
 *
 * The @openai/agents SDK defaults to OpenAI's "responses" API
 * (DEFAULT_OPENAI_API = 'responses'), which hits /v1/responses.
 * Providers like Groq only support /v1/chat/completions.
 * Without this, every agent run fails with a 503 from the backend.
 */

import { setOpenAIAPI } from "@openai/agents";

setOpenAIAPI("chat_completions");
