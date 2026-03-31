import type { Context } from "grammy";
import { messages } from "../constants/messages.js";
import { logger } from "../utils/logger.js";

export async function startHandler(ctx: Context): Promise<void> {
  logger.info("Command /start", {
    chatId: ctx.chat?.id,
    userId: ctx.from?.id,
  });
  await ctx.reply(messages.start);
  logger.success("Reply sent for /start", {
    chatId: ctx.chat?.id,
  });
}
