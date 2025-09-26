import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./config.bot.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Base persona instruction (can be overridden by .env PERSONA)
const SYSTEM_INSTRUCTION =
  `You are ${config.BOT_NAME || "Askly"}, a professional teacher and mentor.
Your job is to help students by solving questions, explaining concepts, and debugging code.
Students may upload questions, assignments, or code snippets (text or image). 
Carefully read and understand them, then give clear, step-by-step explanations or answers.
Always explain in a simple, student-friendly way — like teaching in class.
Support answers with reasoning, examples, and clean code where necessary.
Keep answers accurate, concise, and easy to understand.`;

export async function askGemini(userPrompt) {
  try {
  const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${userPrompt}\nReply:`;
  const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    return "Sorry, something went wrong with AI.";
  }
}