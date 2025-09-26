import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chats.route.js';
import postRouter from './routes/post.route.js';
import cors from 'cors';

const app = express();

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Origin:', req.get('Origin'));
    console.log('Headers:', req.headers);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS configuration for production
app.use(cors({
    origin: [
        'https://askmatic.vercel.app',
        'http://localhost:5173', // for local development
        'http://localhost:3000',
        'https://localhost:5173'
    ], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cookie'
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200 // for legacy browser support
}));

app.use(cookieParser());

// Additional security headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cookie');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Samadhan API Server is running', 
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/post',postRouter);

// 404 handler - catch all unmatched routes
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        availableRoutes: ['/api/auth', '/api/chat', '/api/post']
    });
});


export default app;