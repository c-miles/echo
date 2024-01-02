import mongoose from "mongoose";

const SDPSchema = new mongoose.Schema({
  userId: String,
  sdp: String,
});

export const SDP = mongoose.model("SDP", SDPSchema);
