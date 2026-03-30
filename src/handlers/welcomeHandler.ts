import type { Bot, Context } from "grammy";

import { BOT_MESSAGES } from "../constants/messages.js";
import { formatUserName } from "../utils/formatUserName.js";

export function registerWelcomeHandler(bot: Bot<Context>): void {
  bot.on("message:new_chat_members", async (ctx) => {
    const newMembers = ctx.message.new_chat_members;

    for (const member of newMembers) {
      const name = formatUserName(member.first_name, member.username);
      await ctx.reply(BOT_MESSAGES.welcome(name));
    }
  });
}
