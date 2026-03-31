import type { Context } from "grammy";
import { messages } from "../constants/messages.js";
import { logger } from "../utils/logger.js";

export async function helpHandler(ctx: Context): Promise<void> {
  logger.info("Command /help", {
    chatId: ctx.chat?.id,
    userId: ctx.from?.id,
  });
  await ctx.reply(messages.help);
  logger.success("Reply sent for /help", {
    chatId: ctx.chat?.id,
  });
}
