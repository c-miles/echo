import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true },
  picture: {
    type: String,
    default:
      "https://t4.ftcdn.net/jpg/00/64/67/27/240_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg",
  },
  username: { type: String, unique: true },
  usernameSet: { type: Boolean, default: false },
});

export const User = mongoose.model("User", UserSchema);
