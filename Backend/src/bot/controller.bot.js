import whatsappPkg from "whatsapp-web.js";
const { Client } = whatsappPkg;
import qrcode from "qrcode-terminal";
import { handleCommand } from "./command.bot.js";
import { askGemini } from "./service.bot.js";
import { config } from "./config.bot.js";

export function startBot() {
  const client = new Client();

  client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
    console.log("📱 Scan this QR with WhatsApp app to log in!");
  });

  client.on("ready", () => {
    console.log("✅ Bot is ready!");
  });

  client.on("message", async msg => {
    const text = msg.body.trim();

    // 🔹 AI Command
    if (text.toLowerCase().startsWith("ai ")) {
      const prompt = text.slice(3);
      const response = await askGemini(prompt);
      msg.reply(`🤖 ${config.BOT_NAME} (AI):\n${response}`);
      return;
    }

    // 🔹 Group Tagging (@number or @name)
    if (msg.from.includes("@g.us") && text.includes(config.BOT_NAME)) {
      const response = await askGemini(`Group message context: ${text}`);
      msg.reply(`👋 ${config.BOT_NAME}:\n${response}`);
      return;
    }

    // 🔹 Normal Commands
    const commandResponse = await handleCommand(msg);
    if (commandResponse) {
      msg.reply(commandResponse);
    }
  });

  client.initialize();
}