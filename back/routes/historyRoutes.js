const express = require("express");
const router = express.Router();
// const {
//   getHistory,
//   addHistory,
//   getHistoryByReportId,
// } = require("../controllers/historyController");
// const authMiddleware = require("../middlewares/authMiddleware");

// /**
//  * @swagger
//  * /history:
//  *   get:
//  *     summary: Get history entries
//  *     tags: [History]
//  *     responses:
//  *       200:
//  *         description: List of history entries
//  *       500:
//  *         description: Internal server error
//  */

// /**
//  * @swagger
//  * /history:
//  *   post:
//  *     summary: Add a history entry
//  *     tags: [History]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               action:
//  *                 type: string
//  *               timestamp:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: History entry added successfully
//  *       400:
//  *         description: Bad request
//  */

// /**
//  * @swagger
//  * /history/{reportId}:
//  *   get:
//  *     summary: Get history for a specific report
//  *     tags: [History]
//  *     parameters:
//  *       - in: path
//  *         name: reportId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Report ID
//  *     responses:
//  *       200:
//  *         description: History entries for the report
//  *       500:
//  *         description: Internal server error
//  */

// Get history for a specific report
// router.get("/:reportId", getHistoryByReportId);

// Get history
// router.get("/", getHistory);

// Add history entry
// router.post("/", addHistory);

module.exports = router;
