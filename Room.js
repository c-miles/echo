import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: String,
});

export const Room = mongoose.model("Room", RoomSchema);
