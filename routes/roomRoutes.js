import express from "express";
import shortid from "shortid";

import { Room } from "../models/Room.js";

const router = express.Router();

router.get("/find-by-pin/:pin", async (req, res) => {
  try {
    const pin = req.params.pin;
    const room = await Room.findOne({ pin: pin });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ roomId: room._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const pin = shortid.generate();
    const newRoom = new Room({ pin: pin });
    const savedRoom = await newRoom.save();

    res.status(201).json({ roomId: savedRoom._id, pin: pin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
