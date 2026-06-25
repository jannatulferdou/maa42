import prisma from "../../lib/prisma";
import config from "../../config";
import { LlmMessage } from "./chat.llm";
import { summarize } from "./chat.llm";
import { SYSTEM_PROMPT, MEMORY_PREFIX } from "./chat.prompts";

type UserRow = { id: number; chatSummary: string | null };

async function getUser(uid: string): Promise<UserRow> {
  const user = await prisma.user.findUnique({
    where: { uid },
    select: { id: true, chatSummary: true },
  });
  if (!user) throw new Error("User not found");
  return user;
}

function isStale(lastMessageAt: Date): boolean {
  const ageMs = Date.now() - new Date(lastMessageAt).getTime();
  return ageMs > config.chat_session_timeout_minutes * 60 * 1000;
}

/**
 * Ends a session: generate the updated rolling summary from
 * (existing summary + this session's transcript) and overwrite the user's
 * single summary. Also stores a short title on the session for history.
 */
async function endAndSummarizeSession(sessionId: number, user: UserRow) {
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });

  // Nothing was said — just close it, no summary work.
  if (messages.length === 0) {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });
    return;
  }

  const transcript = messages
    .map((m) => `${m.role === "assistant" ? "Sophia" : "Mother"}: ${m.content}`)
    .join("\n");

  let summary = user.chatSummary;
  let title = "Conversation";
  try {
    const result = await summarize(user.chatSummary, transcript);
    summary = result.summary;
    title = result.title;
  } catch (err) {
    // If summarization fails, still close the session so it doesn't loop.
    console.error("Summarization failed:", (err as Error).message);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { chatSummary: summary },
    }),
    prisma.chatSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date(), title },
    }),
  ]);
}

/**
 * Returns the active session for a user, rolling over (end + summarize +
 * create new) if the current active session has gone stale.
 */
async function resolveActiveSession(user: UserRow) {
  const active = await prisma.chatSession.findFirst({
    where: { userId: user.id, endedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (active && !isStale(active.lastMessageAt)) {
    return active;
  }

  if (active && isStale(active.lastMessageAt)) {
    // Use the freshest summary for summarization.
    const fresh = await getUserById(user.id);
    await endAndSummarizeSession(active.id, fresh);
  }

  return prisma.chatSession.create({
    data: { userId: user.id },
  });
}

async function getUserById(id: number): Promise<UserRow> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, chatSummary: true },
  });
  if (!user) throw new Error("User not found");
  return user;
}

function buildSystemMessage(summary: string | null): LlmMessage {
  const content = summary?.trim()
    ? SYSTEM_PROMPT + MEMORY_PREFIX + summary.trim()
    : SYSTEM_PROMPT;
  return { role: "system", content };
}

export const ChatService = {
  /**
   * Resolve/rollover the session, persist the user's message, and build the
   * full LLM message array (system + memory + this session's messages).
   */
  async prepareForReply(uid: string, message: string) {
    const user = await getUser(uid);
    const session = await resolveActiveSession(user);

    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "user", content: message },
    });
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { lastMessageAt: new Date() },
    });

    const history = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      select: { role: true, content: true },
    });

    const llmMessages: LlmMessage[] = [
      buildSystemMessage(user.chatSummary),
      ...history.map((m) => ({ role: m.role as LlmMessage["role"], content: m.content })),
    ];

    return { sessionId: session.id, llmMessages };
  },

  async saveAssistantReply(sessionId: number, content: string) {
    if (!content.trim()) return;
    await prisma.chatMessage.create({
      data: { sessionId, role: "assistant", content },
    });
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { lastMessageAt: new Date() },
    });
  },

  /** Messages of the current (non-stale) active session, for screen load. */
  async getCurrentSession(uid: string) {
    const user = await getUser(uid);
    const active = await prisma.chatSession.findFirst({
      where: { userId: user.id, endedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!active || isStale(active.lastMessageAt)) {
      return { sessionId: null, messages: [] as { role: string; content: string }[] };
    }
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: active.id },
      orderBy: { createdAt: "asc" },
      select: { role: true, content: true },
    });
    return { sessionId: active.id, messages };
  },

  /** Past sessions (with content) for the history list. */
  async listSessions(uid: string) {
    const user = await getUser(uid);
    return prisma.chatSession.findMany({
      where: { userId: user.id, messages: { some: {} } },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, endedAt: true },
    });
  },

  async getSessionMessages(sessionId: number) {
    return prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      select: { id: true, role: true, content: true, createdAt: true },
    });
  },
};
