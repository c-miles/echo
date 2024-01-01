import mongoose from "mongoose";

const powerRangerSchema = new mongoose.Schema({
  name: String,
  megazord: String,
});

export const PowerRanger = mongoose.model("PowerRanger", powerRangerSchema);
