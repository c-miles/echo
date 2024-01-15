import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connect } from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import { socketEvents } from "./socketEvents.js";
import userRoutes from "./userRoutes.js";

import { Room } from "./Room.js";

dotenv.config();
connect(process.env.MONGODB_URI);

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);

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
