import express from "express";
import multer from "multer";
import { authUser } from "../middlewares/auth.middleware.js";
import { createPostController } from "../controllers/post.controller.js";

const router = express.Router();
const upload = multer(); 

router.post('/', authUser, upload.single('image'), createPostController);

export default router;