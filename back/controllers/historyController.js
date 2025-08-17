const History = require("../models/History");

// Get all history entries
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find().populate("user", "name email");
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err });
  }
};

// Add a new history entry
exports.addHistory = async (req, res) => {
  try {
    const { report, action } = req.body;
    const history = new History({
      report,
      action,
      user: req.user._id,
    });
    const savedHistory = await history.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    res.status(500).json({ message: "Error adding history entry", error: err });
  }
};

// Get history for a specific report
exports.getHistoryByReportId = async (req, res) => {
  try {
    const history = await History.find({
      report: req.params.reportId,
    }).populate("user", "name email");
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err });
  }
};
