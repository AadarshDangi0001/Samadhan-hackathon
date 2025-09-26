import express from 'express';

import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chats.route.js';
import postRouter from './routes/post.route.js';
import cors from 'cors';



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));

app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/post',postRouter);


export default app;