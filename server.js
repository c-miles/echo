import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";

import { connect } from "mongoose";
import { PowerRanger } from "./PowerRanger.js";
import { Room } from "./Room.js";

dotenv.config();
connect(process.env.MONGODB_URI);

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/power-rangers", async (req, res) => {
  try {
    const rangers = await PowerRanger.find();
    res.json(rangers);
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

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("sendMessage", (msg) => {
    console.log("Received message:", msg);
    io.emit("receiveMessage", msg);
  });
});

const port = 3000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
