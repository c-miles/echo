import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connect } from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import { socketEvents } from "./sockets/socketEvents.js";
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connect(process.env.MONGODB_URI);

const app = express();

app.use(express.json());
app.use(cors());

app.use("/rooms", roomRoutes);
app.use("/user", userRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketEvents(io);

const port = 3000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
