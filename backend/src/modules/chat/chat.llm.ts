import config from "../../config";
import { SUMMARY_SYSTEM_PROMPT } from "./chat.prompts";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export type ChatRole = "system" | "user" | "assistant";
export type LlmMessage = { role: ChatRole; content: string };

function authHeaders() {
  if (!config.openrouter_api_key) {
    throw new Error(
      "OPENROUTER_API_KEY is not set in backend/.env — add your OpenRouter key."
    );
  }
  return {
    Authorization: `Bearer ${config.openrouter_api_key}`,
    "Content-Type": "application/json",
    // Optional but recommended by OpenRouter for attribution.
    "HTTP-Referer": "https://maa42.app",
    "X-Title": "Maa42 Sophia",
  };
}

/**
 * Opens a streaming chat completion against OpenRouter and returns the raw
 * upstream Response so the caller can pipe SSE chunks to the client.
 */
export async function streamChat(messages: LlmMessage[]): Promise<Response> {
  const model = config.openrouter_model;
  console.log(`[Sophia LLM] Streaming request to model: ${model}`);
  console.log(`[Sophia LLM] Messages count: ${messages.length}`);

  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        model,
        stream: true,
        max_tokens: 2048,
        messages,
      }),
    });
  } catch (fetchError: any) {
    console.error("[Sophia LLM] Network error calling OpenRouter:", fetchError.message);
    throw new Error(`Network error reaching OpenRouter: ${fetchError.message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[Sophia LLM] OpenRouter returned HTTP ${res.status}: ${text.slice(0, 1000)}`);
    throw new Error(`OpenRouter error ${res.status}: ${text.slice(0, 500)}`);
  }

  if (!res.body) {
    console.error("[Sophia LLM] OpenRouter response has no body (streaming not supported?)");
    throw new Error("OpenRouter returned an empty response body.");
  }

  console.log("[Sophia LLM] Stream opened successfully");
  return res;
}

/**
 * Generates the updated rolling summary (and a short title) for a finished
 * session. Non-streaming. Falls back gracefully if the model doesn't return
 * clean JSON.
 */
export async function summarize(
  previousSummary: string | null,
  transcript: string
): Promise<{ summary: string; title: string }> {
  const userContent = `PREVIOUS NOTE:\n${
    previousSummary?.trim() || "(none yet)"
  }\n\nLATEST CONVERSATION:\n${transcript}`;

  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        model: config.openrouter_model,
        max_tokens: 600,
        messages: [
          { role: "system", content: SUMMARY_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });
  } catch (fetchError: any) {
    console.error("[Sophia LLM] Network error during summarize:", fetchError.message);
    throw new Error(`Network error during summarize: ${fetchError.message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[Sophia LLM] Summarize error HTTP ${res.status}: ${text.slice(0, 1000)}`);
    throw new Error(`OpenRouter summarize error ${res.status}: ${text.slice(0, 500)}`);
  }

  const data: any = await res.json();
  const raw: string = data?.choices?.[0]?.message?.content ?? "";

  // The model is asked for strict JSON, but be defensive.
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : raw);
    return {
      summary: String(parsed.summary ?? previousSummary ?? "").trim(),
      title: String(parsed.title ?? "Conversation").trim(),
    };
  } catch {
    return {
      summary: (raw || previousSummary || "").trim(),
      title: "Conversation",
    };
  }
}
