import { Request, Response } from "express";
import { ChatService } from "./chat.service";
import { streamChat } from "./chat.llm";
import { sendMessageSchema } from "./chat.validation";

/**
 * POST /message — streams Sophia's reply as Server-Sent Events.
 * Each token is sent as:  data: {"delta":"..."}\n\n
 * The stream ends with:    data: [DONE]\n\n
 * The full assistant reply is persisted once streaming completes.
 */
const sendMessage = async (req: Request, res: Response) => {
  let parsed;
  try {
    parsed = sendMessageSchema.parse(req.body);
  } catch (error: any) {
    console.error("[Chat] Validation error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request",
    });
  }

  // Anything that can fail synchronously (user lookup, opening the LLM stream)
  // happens before we switch the response into SSE mode, so errors stay JSON.
  let sessionId: number;
  let upstream: Awaited<ReturnType<typeof streamChat>>;
  try {
    console.log(`[Chat] Preparing reply for uid=${parsed.uid}, message="${parsed.message.slice(0, 80)}..."`);
    const prepared = await ChatService.prepareForReply(parsed.uid, parsed.message);
    sessionId = prepared.sessionId;
    console.log(`[Chat] Session ${sessionId} ready, calling LLM...`);
    upstream = await streamChat(prepared.llmMessages);
  } catch (error: any) {
    console.error("[Chat] Failed to prepare/start chat:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to start chat",
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const reader = upstream.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;

        try {
          const json = JSON.parse(data);
          const delta: string = json?.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            full += delta;
            res.write(`data: ${JSON.stringify({ delta })}\n\n`);
          }
        } catch {
          // Ignore keep-alive comments / non-JSON lines.
        }
      }
    }

    await ChatService.saveAssistantReply(sessionId, full);
    console.log(`[Chat] Session ${sessionId} complete, reply length=${full.length}`);
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("[Chat] Stream error:", error.message, error.stack);
    // Persist whatever we managed to stream, then signal the error.
    await ChatService.saveAssistantReply(sessionId, full).catch(() => {});
    res.write(`data: ${JSON.stringify({ error: error.message || "stream error" })}\n\n`);
    res.end();
  }
};

const getCurrent = async (req: Request, res: Response) => {
  try {
    const data = await ChatService.getCurrentSession(String(req.params.uid));
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("[Chat] getCurrent error:", error.message);
    res.status(500).json({ success: false, message: error.message || "Failed to load chat" });
  }
};

const getSessions = async (req: Request, res: Response) => {
  try {
    const data = await ChatService.listSessions(String(req.params.uid));
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("[Chat] getSessions error:", error.message);
    res.status(500).json({ success: false, message: error.message || "Failed to load history" });
  }
};

const getSessionMessages = async (req: Request, res: Response) => {
  try {
    const data = await ChatService.getSessionMessages(Number(req.params.sessionId));
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("[Chat] getSessionMessages error:", error.message);
    res.status(500).json({ success: false, message: error.message || "Failed to load messages" });
  }
};

export const ChatController = {
  sendMessage,
  getCurrent,
  getSessions,
  getSessionMessages,
};
