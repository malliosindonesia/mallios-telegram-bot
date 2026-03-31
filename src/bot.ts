import { Bot } from "grammy";
import { env } from "./config/env.js";
import { startHandler } from "./handlers/startHandler.js";
import { helpHandler } from "./handlers/helpHandler.js";
import { welcomeHandler } from "./handlers/welcomeHandler.js";
import { aiHandler } from "./handlers/aiHandler.js";

const bot = new Bot(env.botToken);

bot.command("start", startHandler);
bot.command("help", helpHandler);

bot.on("message:new_chat_members", welcomeHandler);
bot.on("message:text", aiHandler);

bot.catch((err) => {
  console.error("Bot error:", err);
});

console.log("Bot sedang berjalan...");
bot.start();