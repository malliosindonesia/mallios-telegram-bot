export const messages = {
  start: `Welcome aboard. 
I am the Mallios Telegram bot, built to power futuristic community onboarding and AI-assisted support.

Available commands:
- /start
- /help`,

  help: `Command center:
- The bot welcomes new members with a crypto-style onboarding message
- The bot handles basic commands
- The bot can route advanced prompts to AI`,

  welcomeGifUrl:
    "https://media.giphy.com/media/xTiTnxpQ3ghPiB2Hp6/giphy.gif",

  groupWelcome: (name: string): string => `Welcome to the next frontier, ${name}.

Mallios is where innovation, precision, and future-ready health technology converge.
You have just entered a high-signal ecosystem built for bold ideas, smart execution, and long-term impact.

Sync with the network, explore the links below, and lock into the mission.
Stay sharp, stay curious, and enjoy the ride.`,

  pendingLink:
    "This portal is ready, but the direct link has not been connected yet.",

  verifyPending:
    "Verification is not active yet for this bot.",
};
