const mongoose = require("mongoose");

const powerRangerSchema = new mongoose.Schema({
  name: String,
  megazord: String,
});

module.exports = mongoose.model("PowerRanger", powerRangerSchema);
