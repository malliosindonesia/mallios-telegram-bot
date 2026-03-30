import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  BOT_TOKEN: getEnv("BOT_TOKEN"),
  OPENCLAW_API_KEY: getEnv("OPENCLAW_API_KEY"),
};
