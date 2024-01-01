const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
