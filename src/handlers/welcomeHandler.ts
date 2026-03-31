import type { Context } from "grammy";
import { messages } from "../constants/messages.js";
import { formatUserName } from "../utils/formatUserName.js";

export async function welcomeHandler(ctx: Context): Promise<void> {
  const newMembers = ctx.message?.new_chat_members;

  if (!newMembers || newMembers.length === 0) return;

  for (const member of newMembers) {
    if (member.is_bot) continue;

    const name = formatUserName(member);
    await ctx.reply(messages.groupWelcome(name));
  }
}