import { Server } from "socket.io";
import { generateContent, generateVector } from "../services/ai.service.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import messageModel from "../models/message.model.js";
import { createMemory, queryMemory } from "../services/vector.service.js";

function setupSocketServer(server) {
  const io = new Server(server, {
      cors: {
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST"],
    credentials: true
  }
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (!cookies.token) {
      return next(new Error("Authentication error"));
    }
    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.userId);

      if (!user) {
        return next(new Error("Authentication error: user not found"));
      }
      socket.user = user;

      next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      let parsedPayload;

      try {
        if (typeof messagePayload === "string") {
          parsedPayload = JSON.parse(messagePayload);
        } else {
          parsedPayload = messagePayload;
        }

        const { content, chat } = parsedPayload;

       

        const [message,vectors] = await Promise.all([
          messageModel.create({
            user: socket.user._id,
            chat: chat,
            content: content,
            role: "user",
          }),
          generateVector(content),
         
        ]);

       
     
        
         createMemory({
            vectors,
            messageId: message._id,
            metadata: {
              chat: chat,
              user: socket.user._id,
              text: content,
            },
          })

        const [memory, chatHistory] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 3,
            metadata: {
              user: socket.user._id,
            },
          }),
          messageModel
            .find({ chat: chat })
            .sort({ createdAt: -1 })
            .limit(4)
            .lean()
            .then((messages) => messages.reverse()),
        ]);

        const shortTermMemory = chatHistory.map(msg => {
          return {
            role: msg.role,
            parts: [{ text: msg.content }],
          };
        });

        const longTermMemory = [
          {
            role: "user",
            parts: [
              {
                text: `these are some previous messages from the chat ,use them to generate a response
                ${memory.map((item) => item.metadata.text).join("\n")}
              `,
              },
            ],
          },
        ];

        const result = await generateContent([
          ...longTermMemory,
          ...shortTermMemory,
        ]);
        
        socket.emit("ai-response", {
          message: result,
          chat: chat,
        });
   

        const [ responseMessage, responseVectors] = await Promise.all([
           messageModel.create({
          user: socket.user._id,
          chat: chat,
          content: result,
          role: "model",
        }),
        generateVector(result)
        ])

        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: chat,
            user: socket.user._id,
            text: result,
          },
        });

      } catch (error) {
        console.error("Error processing AI message:", error);
        socket.emit("ai-error", {
          error: "Failed to generate AI response",
          chat: parsedPayload?.chat || messagePayload?.chat,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.email);
    });
  });

  return io;
}

export default setupSocketServer;
