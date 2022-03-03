const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
  uuid: String,

  companyName: String,

  cycleType: String,

  currentlyUsedBy: String,

  currentLocation: String,

  currentStandName: String,

  addedOn: String,

  price: Number,

  isOccupied: Boolean,
});

const Cycle = mongoose.model("Cycle", cycleSchema);
module.exports = Cycle;
