import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
     firstName: {
       type: String,
       required: true,
       trim: true,  
     },
     lastName: {
       type: String,
       required: true,
       trim: true,
     }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,       
    trim: true,
    lowercase: true,
  },
  profilePicture: { 
    type: String,
    default: "", 
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


const user = mongoose.model("User", userSchema);

export default user;