import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, picture, id } = req.body;
    const newUser = new User({
      id,
      email,
      picture,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.username) {
      updates.usernameLower = updates.username.toLowerCase();
    }

    const user = await User.findOneAndUpdate(
      { id: id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/check-username/:username", async (req, res) => {
  try {
    const usernameLower = req.params.username.toLowerCase();
    const user = await User.findOne({ usernameLower: usernameLower });

    if (user) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
