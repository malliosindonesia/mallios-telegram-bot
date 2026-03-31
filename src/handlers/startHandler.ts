import type { Context } from "grammy";
import { messages } from "../constants/messages.js";

export async function startHandler(ctx: Context): Promise<void> {
  await ctx.reply(messages.start);
}