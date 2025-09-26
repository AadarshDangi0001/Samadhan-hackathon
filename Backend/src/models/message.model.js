import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
   
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
     
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
     
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model", "system"],
      required: true,
    },
    createdAt: {
      type: Date,       
        default: Date.now,
    },
    updatedAt: {    
      type: Date,
      default: Date.now,
    },
},{
    timestamps: true,   

});


const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;