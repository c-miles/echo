import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connect } from "mongoose";
import { PowerRanger } from "./PowerRanger.js";

const app = express();
const port = 3000;

dotenv.config();
connect(process.env.MONGODB_URI);

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/power-rangers", async (req, res) => {
  try {
    const rangers = await PowerRanger.find();
    res.json(rangers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
