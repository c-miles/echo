import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  message: String,
  roomId: String,
  username: String,
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", MessageSchema);
