import { Bot } from "grammy";

import { env } from "./config/env.js";
import { registerAiHandler } from "./handlers/aiHandler.js";
import { registerHelpHandler } from "./handlers/helpHandler.js";
import { registerStartHandler } from "./handlers/startHandler.js";
import { registerWelcomeHandler } from "./handlers/welcomeHandler.js";

const bot = new Bot(env.BOT_TOKEN);

registerStartHandler(bot);
registerHelpHandler(bot);
registerWelcomeHandler(bot);
registerAiHandler(bot);

bot.catch((error) => {
  console.error("Bot error:", error);
});

bot.start();
