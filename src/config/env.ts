import dotenv from "dotenv";

dotenv.config();

export const env = {
  botToken: process.env.BOT_TOKEN || "",
  botUsername: process.env.BOT_USERNAME || "",
  openclawApiUrl: process.env.OPENCLAW_API_URL || "",
  openclawApiKey: process.env.OPENCLAW_API_KEY || "",
};

if (!env.botToken) {
  throw new Error("BOT_TOKEN belum diisi di file .env");
}

const telegramTokenPattern = /^\d+:[A-Za-z0-9_-]{20,}$/;

if (
  env.botToken === "REDACTED_ROTATE_THIS" ||
  !telegramTokenPattern.test(env.botToken)
) {
  throw new Error(
    "BOT_TOKEN tidak valid. Isi .env dengan token bot Telegram asli dari BotFather, formatnya mirip 123456789:AA..."
  );
}
