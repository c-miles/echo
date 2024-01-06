import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: String,
  participants: [String],
  createdAt: { type: Date, default: Date.now },
});

export const Room = mongoose.model("Room", RoomSchema);
