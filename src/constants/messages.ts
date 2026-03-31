export const messages = {
  start: `Halo! 👋
Saya adalah bot Telegram untuk welcome message dan bantuan AI.

Perintah yang tersedia:
- /start
- /help`,

  help: `Menu bantuan:
- Bot akan menyapa member baru di grup
- Bot bisa membalas command dasar
- Bot bisa dihubungkan ke AI`,

  groupWelcome: (name: string): string => `Halo, ${name}! 👋
Selamat datang di Mallios.

Silakan perkenalkan diri yaa.
Pastikan baca rules grup terlebih dahulu.
Semoga betah dan selamat bergabung 🚀`,
};  