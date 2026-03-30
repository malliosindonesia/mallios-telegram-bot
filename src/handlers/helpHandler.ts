import type { Bot, Context } from "grammy";

import { BOT_MESSAGES } from "../constants/messages.js";

export function registerHelpHandler(bot: Bot<Context>): void {
  bot.command("help", (ctx) => ctx.reply(BOT_MESSAGES.help));
}
