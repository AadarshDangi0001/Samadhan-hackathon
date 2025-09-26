import dotenv from "dotenv";
dotenv.config();

export const config = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  BOT_NAME: process.env.BOT_NAME || "MyBot",
  PERSONA: process.env.PERSONA, // optional override for base AI persona
};
