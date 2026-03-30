import type { Bot, Context } from "grammy";

import { BOT_MESSAGES } from "../constants/messages.js";
import { formatUserName } from "../utils/formatUserName.js";

export function registerStartHandler(bot: Bot<Context>): void {
  bot.command("start", (ctx) => {
    const name = formatUserName(ctx.from?.first_name, ctx.from?.username);

    return ctx.reply(BOT_MESSAGES.start(name));
  });
}
