import type { Bot, Context } from "grammy";

import { BOT_MESSAGES } from "../constants/messages.js";
import { askOpenClaw } from "../services/openclawService.js";

export function registerAiHandler(bot: Bot<Context>): void {
  bot.command("ai", async (ctx) => {
    const prompt = ctx.match?.toString().trim();

    if (!prompt) {
      await ctx.reply(BOT_MESSAGES.aiUsage);
      return;
    }

    const answer = await askOpenClaw(prompt);
    await ctx.reply(answer);
  });
}
