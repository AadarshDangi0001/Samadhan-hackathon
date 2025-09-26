import postModel from "../models/post.model.js";
import {generateImageCaption} from "../services/ai.service.js";
import uploadfile from "../services/storage.service.js";
import { v4 as uuidv4 } from "uuid";

export const createPostController = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }
  const base64ImageFile = Buffer.from(file.buffer).toString("base64");

  const caption = await generateImageCaption(base64ImageFile);

  const result = await uploadfile(file, `${uuidv4()}`);

  const post = await postModel.create({
    userId: req.user._id,
    image: result.url,
    caption: caption,
  });

  res.status(201).json({ 
    message: "Post created successfully",
    post: {
      _id: post._id,
      image: post.image,
      caption: post.caption,
      userId: post.userId,
      createdAt: post.createdAt,
    },
  });
};
