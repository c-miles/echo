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

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("sendMessage", (msg) => {
    console.log("Received message:", msg);
    io.emit("receiveMessage", msg);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendOffer", async ({ roomId, userId, sdp }) => {
    try {
      const room = await Room.findById(roomId);
      if (room) {
        const participantIndex = room.participants.findIndex(
          (p) => p.userId === userId
        );
        if (participantIndex !== -1) {
          // Update existing participant
          room.participants[participantIndex].sdp = sdp;
        } else {
          // Add new participant
          room.participants.push({ userId, sdp });
        }
        await room.save();
        io.to(roomId).emit("offerAvailable", { userId, sdp });
      }
    } catch (error) {
      console.error("Error saving offer:", error);
    }
  });

  socket.on("requestOffer", async ({ roomId }) => {
    try {
      const room = await Room.findById(roomId).exec();
      if (room && room.participants.length > 0) {
        // Assuming the host is the first participant
        const hostSdp = room.participants[0].sdp;
        socket.emit("receiveOffer", { sdp: hostSdp });
      }
    } catch (error) {
      console.error("Error fetching offer:", error);
    }
  });

  socket.on("sendAnswer", ({ roomId, sdp }) => {
    // Send the answer to the host
    socket.to(roomId).emit("receiveAnswer", { sdp });
  });

  socket.on("readyForIce", ({ roomId, userId }) => {
    socket.to(roomId).emit("peerReadyForIce", { userId });
  });

  socket.on("sendCandidate", ({ roomId, userId, candidate }) => {
    // Relay candidate to other participants in the room
    socket.to(roomId).emit("receiveCandidate", { userId, candidate });
  });
});

const port = 3000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
