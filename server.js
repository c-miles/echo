const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose.connect(
  "mongodb+srv://dbMiles:3M3r4ld5%23%23@atlascluster.s6eiwh2.mongodb.net/?retryWrites=true&w=majority"
);

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const PowerRanger = require("./PowerRanger");

app.get("/power-rangers", async (req, res) => {
  try {
    const rangers = await PowerRanger.find();
    res.json(rangers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
