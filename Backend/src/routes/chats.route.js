import express from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { createChat, getChats, getMessages, updateChatTitle, deleteChat, chatWithAI } from '../controllers/chat.controller.js';

const router = express.Router();

// Create new chat
router.post('/', authUser, createChat);

// Get all chats for current user
router.get('/', authUser, getChats);

router.post('/chatwithai', authUser, chatWithAI);

// Get messages for a specific chat
router.get('/messages/:id', authUser, getMessages);

// Update chat title
router.put('/:id', authUser, updateChatTitle);

// Delete chat and all associated messages
router.delete('/:id', authUser, deleteChat);

export default router;