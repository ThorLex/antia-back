const express = require("express");
const router = express.Router();
// const {
//   getHistory,
//   addHistory,
//   getHistoryByReportId,
// } = require("../controllers/historyController");
// const authMiddleware = require("../middlewares/authMiddleware");


/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: API pour la gestion des signalements
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       properties:
 *         caseId:
 *           type: string
 *           description: Identifiant unique du dossier (généré automatiquement).
 *         title:
 *           type: string
 *           description: Titre du signalement.
 *         description:
 *           type: string
 *           description: Description détaillée du signalement.
 *         user:
 *           type: string
 *           description: ID de l'utilisateur qui a créé le signalement.
 *         sourceURL:
 *           type: string
 *           description: URL source du contenu signalé (si applicable).
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des chemins vers les pièces jointes.
 *         status:
 *           type: string
 *           description: Statut actuel du signalement.
 *           enum: [Nouveau, En cours, Traité, Rejeté]
 *         history:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               comments:
 *                 type: string
 *         aiAnalysis:
 *           type: object
 *           properties:
 *             category:
 *               type: string
 *             priority:
 *               type: string
 *             summary:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création.
 */

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
