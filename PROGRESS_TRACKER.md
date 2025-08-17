# Suivi de Projet - Système de Signalement

Ce document suit l'avancement des développements et les prochaines étapes pour le système de signalement.

---

## ✅ Fonctionnalités Implémentées (Session du 15/08/2025)

### 1. Refonte du Modèle de Données
- **Modèle `Report`:**
  - [x] Ajout d'un identifiant unique lisible (`caseId`).
  - [x] Ajout d'un champ `sourceURL` pour les signalements depuis Internet.
  - [x] Ajout d'un champ `attachments` pour stocker les chemins des pièces jointes.
  - [x] Amélioration des statuts (`Nouveau`, `En cours`, `Traité`, `Rejeté`).
  - [x] Ajout d'un champ `history` pour tracer tous les changements de statut.
  - [x] Ajout d'une section `aiAnalysis` pour accueillir les données d'une IA.
- **Modèle `User`:**
  - [x] Ajout d'un champ `phoneNumber` pour les notifications SMS.

### 2. Processus de Signalement Avancé
- [x] Mise en place du téléversement de fichiers (images, audio, vidéo) avec `multer`.
- [x] Limitation de la taille des fichiers à 50 Mo.
- [x] Validation des types de fichiers autorisés.
- [x] La route de création (`POST /api/reports`) gère désormais les données `multipart/form-data`.

### 3. Notifications Automatisées
- **Email (Nodemailer) :**
  - [x] Envoi d'un email de confirmation à l'utilisateur lors de la création d'un signalement.
  - [x] Envoi simultané d'une copie cachée (BCC) du signalement à l'adresse email de l'ANTIC.
  - [x] Les pièces jointes sont incluses dans l'email de confirmation.
- **SMS (Twilio) :**
  - [x] Envoi d'une notification SMS à l'utilisateur lors de chaque changement de statut de son dossier.

### 4. API et Suivi
- [x] Création d'une route `GET /api/reports/byCaseId/:caseId` pour le suivi public d'un dossier.
- [x] Création d'une route `PUT /api/reports/byCaseId/:caseId/status` pour la mise à jour du statut par les modérateurs.
- [x] Création d'une route sécurisée `POST /api/reports/ai-analysis/:caseId` pour les services d'IA externes (protégée par clé d'API).

### 5. Documentation
- [x] Mise à jour complète de la documentation Swagger (`/api-docs`) pour refléter toutes les nouvelles routes, les schémas de données et les exigences (ex: `multipart/form-data`, clé d'API).

---

## 📝 Points à Travailler / Améliorations Possibles

### 1. Gestion des Rôles et Permissions
- **Problème :** Actuellement, n'importe quel utilisateur authentifié peut potentiellement accéder à des routes qui devraient être réservées aux administrateurs (ex: `updateReportStatus`).
- **Solution :**
  - [ ] Ajouter un champ `role` au modèle `User` (ex: `['user', 'moderator', 'admin']`).
  - [ ] Créer un middleware `adminMiddleware.js` ou `roleMiddleware.js` pour protéger les routes sensibles.

### 2. Gestion des Fichiers
- **Problème :** Les fichiers téléversés sont stockés localement. Cela ne fonctionnera pas sur des plateformes de déploiement sans système de fichiers persistant (comme Heroku) et n'est pas optimal pour la scalabilité.
- **Solution :**
  - [ ] Intégrer un service de stockage d'objets cloud comme **Amazon S3**, **Google Cloud Storage** ou **Cloudinary**.
  - [ ] Mettre à jour le `uploadMiddleware` pour envoyer les fichiers directement vers le service cloud au lieu du disque local.

### 3. Sécurité et Validation
- **Problème :** La validation des entrées pourrait être plus robuste.
- **Solution :**
  - [ ] Utiliser une bibliothèque de validation comme `Joi` ou `express-validator` sur toutes les routes pour nettoyer et valider les `req.body`, `req.params` et `req.query`.
  - [ ] Ajouter des règles de validation plus strictes (ex: format du `phoneNumber`, complexité du mot de passe lors de l'inscription).

### 4. Tests
- **Problème :** Le projet a des fichiers de test mais ils ne couvrent pas les nouvelles fonctionnalités.
- **Solution :**
  - [ ] Écrire des tests d'intégration pour le nouveau flux de création de signalement (incluant le téléversement de mock-files).
  - [ ] Tester les endpoints de mise à jour de statut et d'analyse par l'IA.
  - [ ] Mocker les services externes (`nodemailer`, `twilio`) pour les tests unitaires/intégration.

### 5. Interface Utilisateur (Frontend)
- **Problème :** Le backend est maintenant puissant, mais le frontend (non fourni) doit être mis à jour pour l'utiliser.
- **Solution :**
  - [ ] Mettre à jour les formulaires de signalement pour inclure les champs `sourceURL` et le téléversement de fichiers.
  - [ ] Créer une page de suivi de dossier où un utilisateur peut entrer son `caseId`.
  - [ ] Afficher l'historique et le statut actuel du dossier.
