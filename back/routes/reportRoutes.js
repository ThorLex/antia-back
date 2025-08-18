const express = require("express");
const router = express.Router();
const {
  createReport,
  getReports,
  updateReport,
  deleteReport,
  getReportByCaseId,
  updateReportStatus,
  updateReportWithAiAnalysis,
} = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const apiKeyMiddleware = require("../middlewares/apiKeyMiddleware");

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

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Crée un nouveau signalement
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               sourceURL:
 *                 type: string
 *                 description: URL du contenu à signaler.
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Pièces jointes (images, audio, vidéo). Jusqu'à 5 fichiers.
 *     responses:
 *       201:
 *         description: Signalement créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       400:
 *         description: Données d'entrée invalides.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post("/", authMiddleware, upload.array("attachments", 5), createReport);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Récupère tous les signalements (avec pagination)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Terme de recherche dans le titre, la description ou le statut.
 *     responses:
 *       200:
 *         description: Liste des signalements.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/", authMiddleware, getReports);

/**
 * @swagger
 * /reports/byCaseId/{caseId}:
 *   get:
 *     summary: Récupère un signalement par son identifiant de dossier (caseId)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique du dossier.
 *     responses:
 *       200:
 *         description: Détails du signalement.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Signalement non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/byCaseId/:caseId", authMiddleware, getReportByCaseId);

/**
 * @swagger
 * /reports/byCaseId/{caseId}/status:
 *   put:
 *     summary: Met à jour le statut d'un signalement
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique du dossier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Nouveau, En cours, Traité, Rejeté]
 *               comments:
 *                 type: string
 *                 description: Commentaire sur le changement de statut.
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès.
 *       404:
 *         description: Signalement non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put("/byCaseId/:caseId/status", authMiddleware, updateReportStatus);

/**
 * @swagger
 * /reports/ai-analysis/{caseId}:
 *   post:
 *     summary: Endpoint pour que l'IA mette à jour un signalement avec son analyse
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique du dossier.
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Clé d'API pour le service IA.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: Catégorie déterminée par l'IA.
 *               priority:
 *                 type: string
 *
 *               summary:
 *                 type: string
 *                 description: Résumé de l'analyse de l'IA.
 *     responses:
 *       200:
 *         description: Analyse de l'IA enregistrée avec succès.
 *       401:
 *         description: Non autorisé (clé d'API invalide).
 *       404:
 *         description: Signalement non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post(
  "/ai-analysis/:caseId",
  apiKeyMiddleware,
  updateReportWithAiAnalysis
);

// The old routes are kept for now but should be deprecated or removed later.
router.put("/:id", authMiddleware, updateReport);
router.delete("/:id", authMiddleware, deleteReport);

module.exports = router;
