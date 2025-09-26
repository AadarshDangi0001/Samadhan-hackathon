import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    image : {
        type: String,
        required: true
    },
    caption :String,
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }   
})

const postModel = mongoose.model("post",postSchema);
export default postModel;