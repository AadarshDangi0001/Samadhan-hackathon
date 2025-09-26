import express from 'express';
import { loginUser, registerUser , logoutUser, getUserProfile} from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Test endpoint
router.post('/test', (req, res) => {
    console.log('Test endpoint hit - Body:', req.body);
    console.log('Test endpoint hit - Headers:', req.headers);
    res.json({ 
        message: 'Test endpoint working',
        body: req.body,
        headers: req.headers
    });
});

router.post('/register', registerUser );
router.post('/login', loginUser );
router.post('/logout', logoutUser );
router.get('/profile', authUser, getUserProfile );



export default router;