const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
} = require("../controllers/authController");


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
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Bad request
 */

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
// router.post("/update-profile", updateProfile);
// router.post("/delete-account", deleteAccount);
// router.post("/verify-email", verifyEmail);

module.exports = router;
