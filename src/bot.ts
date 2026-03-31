import { Bot } from "grammy";
import { env } from "./config/env.js";
import { messages } from "./constants/messages.js";
import { startHandler } from "./handlers/startHandler.js";
import { helpHandler } from "./handlers/helpHandler.js";
import { welcomeHandler } from "./handlers/welcomeHandler.js";
import { aiHandler } from "./handlers/aiHandler.js";
import { describeError, logger } from "./utils/logger.js";

const bot = new Bot(env.botToken);

bot.use(async (ctx, next) => {
  const updateType =
    "message" in ctx.update
      ? "message"
      : "callback_query" in ctx.update
        ? "callback_query"
        : Object.keys(ctx.update)[0] ?? "unknown";
  const text = ctx.message?.text ?? ctx.callbackQuery?.data;

  logger.trace("Incoming update", {
    updateType,
    chatId: ctx.chat?.id,
    userId: ctx.from?.id,
    userName: ctx.from?.username,
    text,
  });

  await next();
});

bot.command("start", startHandler);
bot.command("help", helpHandler);

bot.on("message:new_chat_members", welcomeHandler);
bot.on("message:text", aiHandler);
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;

  logger.info("Callback tapped", {
    chatId: ctx.chat?.id,
    userId: ctx.from?.id,
    data,
  });

  if (data.startsWith("link:")) {
    await ctx.answerCallbackQuery({
      text: messages.pendingLink,
      show_alert: true,
    });
    return;
  }

  if (data === "verify:pending") {
    await ctx.answerCallbackQuery({
      text: messages.verifyPending,
      show_alert: true,
    });
  }
});

bot.catch((err) => {
  logger.error("Bot middleware crashed", describeError(err.error));
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", describeError(reason));
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", describeError(error));
});

logger.banner("       Mallios Bot Party Console", {
  botUsername: env.botUsername || "(not set)",
  aiMode: "openclaw/local",
});
logger.success("Bot is running and listening for chaos");
bot.start();
