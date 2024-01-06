import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  userId: String,
  sdp: String,
});

const RoomSchema = new mongoose.Schema({
  roomId: String,
  participants: [ParticipantSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Room = mongoose.model("Room", RoomSchema);
