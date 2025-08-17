const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sourceURL: {
    type: String,
    trim: true,
  },
  attachments: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["Nouveau", "En cours", "Traité", "Rejeté"],
    default: "Nouveau",
  },
  history: [
    {
      status: String,
      date: Date,
      comments: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  aiAnalysis: {
    category: String,
    priority: String,
    summary: String,
    analyzedAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
