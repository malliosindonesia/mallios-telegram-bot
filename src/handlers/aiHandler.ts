import type { Context } from "grammy";
import { env } from "../config/env.js";
import { askOpenClaw } from "../services/openclawService.js";
import { formatUserName } from "../utils/formatUserName.js";

export async function aiHandler(ctx: Context): Promise<void> {
  const text = ctx.message?.text;
  if (!text) return;

  if (text.startsWith("/")) return;

  const userPrompt = extractAiPrompt(text);

  if (!userPrompt) return;

  if (!userPrompt.trim()) {
    await ctx.reply("Tulis pertanyaan setelah memanggil Sandra.");
    return;
  }

  const instantReply = getInstantReply(userPrompt, formatUserName(ctx.from));
  if (instantReply) {
    await ctx.reply(instantReply);
    return;
  }

  try {
    const answer = await askOpenClaw(userPrompt, buildSessionId(ctx));
    await ctx.reply(answer);
  } catch (error) {
    console.error("AI handler error:", error);
    await ctx.reply("Maaf, AI sedang bermasalah. Coba lagi nanti.");
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
    normalized.startsWith("halo sandra") ||
    normalized.startsWith("hai sandra") ||
    normalized.startsWith("hi sandra")
  ) {
    return `Halo, ${userName}. Aku siap bantu.`;
  }

  if (
    normalized === "apa kabar" ||
    normalized === "kabar" ||
    normalized === "apa kabar sandra"
  ) {
    return `Baik. Kamu gimana, ${userName}?`;
  }

  if (
    normalized.includes("terima kasih") ||
    normalized === "makasih" ||
    normalized === "thanks"
  ) {
    return "Sama-sama. Kalau mau lanjut, tinggal panggil Sandra lagi.";
  }

  if (
    normalized === "siapa kamu" ||
    normalized === "kamu siapa" ||
    normalized === "sandra siapa"
  ) {
    return "Aku Sandra, bot Telegram yang bantu jawab cepat dan bisa lanjut ke AI kalau pertanyaannya lebih berat.";
  }

  if (
    normalized === "bisa bantu apa" ||
    normalized === "kamu bisa apa" ||
    normalized === "help"
  ) {
    return "Aku bisa jawab sapaan cepat langsung, dan untuk pertanyaan yang lebih serius aku teruskan ke AI.";
  }

  return null;
}
