import { InlineKeyboard, type Context } from "grammy";
import { messages } from "../constants/messages.js";
import { formatUserName } from "../utils/formatUserName.js";
import { logger } from "../utils/logger.js";

export async function welcomeHandler(ctx: Context): Promise<void> {
  const newMembers = ctx.message?.new_chat_members;

  if (!newMembers || newMembers.length === 0) return;

  for (const member of newMembers) {
    if (member.is_bot) {
      logger.trace("Skipped bot account in welcome flow", {
        memberId: member.id,
        chatId: ctx.chat?.id,
      });
      continue;
    }

    const name = formatUserName(member);
    logger.info("Welcoming new member", {
      chatId: ctx.chat?.id,
      memberId: member.id,
      memberName: name,
    });
    const keyboard = new InlineKeyboard()
      .url("Website", "https://www.mallioshealth.com/")
      .row()
      .text("Telegram", "link:telegram")
      .row()
      .text("X/Twitter", "link:twitter")
      .row()
      .url("Instagram", "https://www.instagram.com/malliosofficial/")
      .row()
      .text("Whitepaper", "link:whitepaper")
      .row()
      .text("Tap to verify", "verify:pending");

    await ctx.replyWithAnimation(messages.welcomeGifUrl, {
      caption: messages.groupWelcome(name),
      reply_markup: keyboard,
    });
    logger.success("Welcome pack dropped", {
      chatId: ctx.chat?.id,
      memberId: member.id,
    });
  }
}
