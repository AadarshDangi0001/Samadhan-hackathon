import express from 'express';
import { loginUser, registerUser , logoutUser, getUserProfile} from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser );
router.post('/login', loginUser );
router.post('/logout', logoutUser );
router.get('/profile', authUser, getUserProfile );



export default router;