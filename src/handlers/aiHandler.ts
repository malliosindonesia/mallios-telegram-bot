import type { Context } from "grammy";
import { env } from "../config/env.js";
import { askOpenClaw } from "../services/openclawService.js";
import { formatUserName } from "../utils/formatUserName.js";
import { describeError, logger } from "../utils/logger.js";

export async function aiHandler(ctx: Context): Promise<void> {
  const text = ctx.message?.text;
  if (!text) return;

  if (text.startsWith("/")) return;

  const userPrompt = extractAiPrompt(text);

  if (!userPrompt) {
    logger.trace("Message ignored by AI handler", {
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
      text,
    });
    return;
  }

  if (!userPrompt.trim()) {
    logger.warn("AI called without prompt", {
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
    });
    await ctx.reply("Write your question after calling Sandra.");
    return;
  }

  const instantReply = getInstantReply(userPrompt, formatUserName(ctx.from));
  if (instantReply) {
    logger.info("Instant AI reply matched", {
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
      prompt: userPrompt,
    });
    await ctx.reply(instantReply);
    logger.success("Instant reply delivered", {
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
    });
    return;
  }

  try {
    const sessionId = buildSessionId(ctx);

    logger.info("Forwarding prompt to OpenClaw", {
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
      sessionId,
      prompt: userPrompt,
    });
    const answer = await askOpenClaw(userPrompt, sessionId);
    await ctx.reply(answer);
    logger.success("OpenClaw answer sent", {
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
      sessionId,
    });
  } catch (error) {
    logger.error("AI handler error", {
      chatId: ctx.chat?.id,
      userId: ctx.from?.id,
      ...describeError(error),
    });
    await ctx.reply("The AI is having trouble right now. Please try again later.");
  }
}

function extractAiPrompt(text: string): string | null {
  const normalized = text.trim();
  const lower = normalized.toLowerCase();
  const botUsername = env.botUsername.toLowerCase().replace(/^@/, "");
  const botName = "sandra";
  const mention = botUsername ? `@${botUsername}` : "";

  if (lower.startsWith(`${botName} `)) {
    return normalized.slice(botName.length).trim();
  }

  if (mention && lower.startsWith(`${mention} `)) {
    return normalized.slice(mention.length).trim();
  }

  const greetingPrefixes = ["halo ", "hai ", "hi "];
  for (const prefix of greetingPrefixes) {
    if (lower.startsWith(prefix)) {
      const rest = normalized.slice(prefix.length).trim();
      const restLower = rest.toLowerCase();

      if (restLower === botName) {
        return "";
      }

      if (restLower.startsWith(`${botName} `)) {
        return rest.slice(botName.length).trim();
      }

      if (mention && restLower === mention) {
        return "";
      }

      if (mention && restLower.startsWith(`${mention} `)) {
        return rest.slice(mention.length).trim();
      }
    }
  }

  return null;
}

function buildSessionId(ctx: Context): string {
  const chatId = ctx.chat?.id ?? "unknown-chat";
  const userId = ctx.from?.id ?? "unknown-user";

  return `telegram-${chatId}-${userId}`;
}

function getInstantReply(prompt: string, userName: string): string | null {
  const normalized = prompt
    .toLowerCase()
    .replace(/[?!.,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return null;

  if (
    ["halo", "hai", "hi", "p", "ping"].includes(normalized) ||
    normalized === "hello" ||
    normalized === "hey" ||
    normalized.startsWith("halo sandra") ||
    normalized.startsWith("hai sandra") ||
    normalized.startsWith("hi sandra") ||
    normalized.startsWith("hello sandra") ||
    normalized.startsWith("hey sandra")
  ) {
    return `Hello, ${userName}. I am online and ready to help.`;
  }

  if (
    normalized === "apa kabar" ||
    normalized === "kabar" ||
    normalized === "apa kabar sandra" ||
    normalized === "how are you" ||
    normalized === "how are you sandra"
  ) {
    return `Systems are stable. How are you doing, ${userName}?`;
  }

  if (
    normalized.includes("terima kasih") ||
    normalized === "makasih" ||
    normalized === "thanks" ||
    normalized === "thank you"
  ) {
    return "Anytime. If you need more, just call Sandra again.";
  }

  if (
    normalized === "siapa kamu" ||
    normalized === "kamu siapa" ||
    normalized === "sandra siapa" ||
    normalized === "who are you" ||
    normalized === "who is sandra"
  ) {
    return "I am Sandra, the Mallios Telegram bot. I handle fast replies and can escalate deeper questions to AI.";
  }

  if (
    normalized === "bisa bantu apa" ||
    normalized === "kamu bisa apa" ||
    normalized === "help" ||
    normalized === "what can you do"
  ) {
    return "I can handle quick replies instantly, and I can route more advanced questions to AI when needed.";
  }

  return null;
}
