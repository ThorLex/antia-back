const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", historySchema);
