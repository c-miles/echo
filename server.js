import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connect } from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import { Room } from "./Room.js";
import { User } from "./User.js";
import { socketEvents } from "./socketEvents.js";

dotenv.config();
connect(process.env.MONGODB_URI);

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketEvents(io);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/create-user", async (req, res) => {
  try {
    const { email, picture } = req.body;
    const newUser = new User({
      email,
      picture,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: updates },
      { new: true }
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

app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/create-room", async (req, res) => {
  try {
    const newRoom = new Room();
    const savedRoom = await newRoom.save();
    res.status(201).json({ roomId: savedRoom._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = 3000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
