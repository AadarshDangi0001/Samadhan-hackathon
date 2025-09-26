import { GoogleGenAI } from "@google/genai";




import dotenv from "dotenv";
dotenv.config();



const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateContent= async (content)=> {
  try {
   
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
      config:{
        temperature:0.7,
        systemInstruction:"You are Askly, the official AI chatbot. You answer questions like a friendly teacher — clear, patient, and easy to understand. Your job is to guide users by giving them accurate, detailed, and supportive answers to their queries. Always explain in a simple, approachable way, while keeping a warm and helpful tone"
      }
    });
   
    return response.text;
    
  } catch (error) {
    console.error("Error in generateResponse:", error);
    throw error;
  }
}

export const generateVector = async(content)=>{
   const response = await ai.models.embedContent({
        model:"gemini-embedding-001",
        contents: content,
        config:{
          outputDimensionality:768
        }
   });

   return response.embeddings[0].values

}

export const generateImage = async (prompt) => {
  try {
    const response = await ai.models.generateImage({
      model: "gemini-1.5-image",
      prompt: prompt,
      config: {
        imageSize: "512x512",
        numImages: 1,
      },
    });

    return response.images[0].url;

  } catch (error) {
    console.error("Error in generateImage:", error);
    throw error;
  }
}

export const generateImageCaption = async (base64ImageFile)=> {

const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile,
    },
  },
  { text: "Caption this image." },
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
  config: {
    systemInstruction: `
  You are Askly, a professional teacher. 
      Students will upload images containing exam questions, assignments, or code snippets. 
      Your task is to carefully read the image, understand it, and then provide a clear, easy explanation. 
      Always explain in a simple, student-friendly way, as if you are teaching in class. 
      Support answers with reasoning, examples, and code where necessary. 
      Keep explanations concise, correct, and easy to understand.`,
  }
});
return response.text;
}



export const getExpertCodingSolution = async (problemStatement) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",   // ✅ use latest model
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a professional expert coding teacher.
Your role is to guide beginners carefully by splitting answers into three parts:

1. First, explain the solution in 5–7 simple clear points.
2. Then, provide the complete optimized code in the most appropriate programming language for the problem.
3. Finally, suggest related resources (like YouTube videos or documentation) that can help the user understand the concept better.

Format your response **exactly like this**:
---
Explanation:
- (point 1)
- (point 2)
- (point 3)
...

Code:
\`\`\`[language]
// your clean code here
\`\`\`

Resources:
- [Video/Doc 1 Title](URL)
- [Video/Doc 2 Title](URL)
---

Problem: "${problemStatement}"
              `
            }
          ]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error in getExpertCodingSolution:", error);
    throw error;
  }
};
