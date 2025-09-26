import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';


export const authUser = async (req, res, next)=> {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        next();
    } catch (error) {
        console.error('Something went wrong with auth middleware', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
}