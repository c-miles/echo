import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  email: { type: String },
  picture: {
    type: String,
    default:
      "https://t4.ftcdn.net/jpg/00/64/67/27/240_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg",
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username must be less than 20 characters long"],
  },
  usernameLower: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true,
  },
});

export const User = mongoose.model("User", UserSchema);
