 import chatModel from "../models/chat.model.js";
 import messageModel from "../models/message.model.js";
import { getExpertCodingSolution } from "../services/ai.service.js";


 export const createChat = async (req, res) => {
        try {
            // Default title if none provided
            const title = req.body.title || "New Chat";
            const userId = req.user._id;

            const newChat = new chatModel({
                user: userId,
                title,
            });

            await newChat.save();

            res.status(201).json({
                message: "Chat created successfully",
                chat: newChat,
            });

        } catch (error) {
            console.error("Error creating chat:", error);
            res.status(500).json({ message: "Server error" });
        }
 }


 export  const getChats = async(req, res)=> {
    const user = req.user;

    const chats = await chatModel.find({ user: user._id });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats: chats.map(chat => ({
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }))
    });
}

export  const getMessages= async (req, res)=> {

    const chatId = req.params.id;

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages: messages
    })

}

export const updateChatTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const userId = req.user._id;

        // Find chat and verify ownership
        const chat = await chatModel.findOne({ _id: id, user: userId });
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

        chat.title = title;
        await chat.save();

        res.status(200).json({
            message: "Chat title updated successfully",
            chat: {
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.updatedAt,
                user: chat.user
            }
        });
    } catch (error) {
        console.error("Error updating chat title:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Find chat and verify ownership
        const chat = await chatModel.findOne({ _id: id, user: userId });
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

        // Delete associated messages first
        await messageModel.deleteMany({ chat: id });
        
        // Delete the chat
        await chatModel.deleteOne({ _id: id });

        res.status(200).json({
            message: "Chat and associated messages deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiResponse = await getExpertCodingSolution(message);

    // Use regex to extract sections more safely - support all languages
    const explanationMatch = aiResponse.match(/Explanation:\s*([\s\S]*?)\s*Code:/i);
    const codeMatch = aiResponse.match(/Code:\s*```\w*([\s\S]*?)```/i);
    const resourcesMatch = aiResponse.match(/Resources:\s*([\s\S]*)/i);

    const explanationPart = explanationMatch ? explanationMatch[1].trim() : '';
    const codePart = codeMatch ? codeMatch[1].trim() : '';
    const resourcesPart = resourcesMatch ? resourcesMatch[1].trim() : '';

    res.json({
      explanation: explanationPart,
      code: codePart,
      resources: resourcesPart,
    });

  } catch (error) {
    console.error('Error in chatWithAI:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


