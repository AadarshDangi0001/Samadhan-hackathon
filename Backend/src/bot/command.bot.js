// whatsapp-web.js is CommonJS; import default then destructure
import whatsappPkg from "whatsapp-web.js";
const { MessageMedia } = whatsappPkg;
import { config } from "./config.bot.js";

export async function handleCommand(msg) {
  const text = msg.body.toLowerCase();

  if (text === "menu") {
    return `📋 Menu:\n1. type 'hi'\n2. type 'media'\n3. tag me in group\n4. type 'ai <your question>'`;
  }

  if (text === "hi") {
    return `Hello! 👋 I am ${config.BOT_NAME}`;
  }

  if (text === "media") {
    const media = MessageMedia.fromFilePath("./files/sample.jpg");
    await msg.reply(media);
    return null; // already replied
  }

  return null; // no match
}