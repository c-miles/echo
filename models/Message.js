import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  roomId: String,
  userId: String,
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", MessageSchema);
