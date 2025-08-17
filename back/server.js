import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import basicAuth from "express-basic-auth";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { swaggerOptions } from "./swaggerOption.js";

const app = express();

// Sécurité générale
app.use(helmet());

// Configuration de l'authentification selon l'environnement
const setupSwaggerSecurity = () => {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    // En développement : accès libre mais avec avertissement
    console.log("⚠️  Mode développement - Documentation Swagger non protégée");
    return (req, res, next) => next();
  }

  // En production : authentification obligatoire
  if (!process.env.SWAGGER_USERNAME || !process.env.SWAGGER_PASSWORD) {
    throw new Error(
      "❌ SWAGGER_USERNAME et SWAGGER_PASSWORD doivent être définis en production !"
    );
  }

  return basicAuth({
    users: {
      [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
    },
    challenge: true,
    realm: "API Documentation - Production",
    unauthorizedResponse: {
      error: "Unauthorized",
      message: "Cette documentation est protégée en production",
    },
  });
};

// Rate limiting pour la documentation (évite les attaques par force brute)
const swaggerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requêtes par IP toutes les 15 minutes
  message: {
    error: "Trop de tentatives d'accès à la documentation",
    retryAfter: "15 minutes",
  },
  skip: (req) => process.env.NODE_ENV !== "production", 
});

// Middleware de sécurité pour Swagger
const swaggerSecurity = setupSwaggerSecurity();

// Générer la documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware généraux
app.use(express.json());

// Route d'information sur la documentation
app.get("/api/docs-info", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.json({
    documentation: "/api-docs",
    protected: isProduction,
    environment: process.env.NODE_ENV || "development",
    message: isProduction
      ? "Documentation protégée par authentification"
      : "Documentation accessible en mode développement",
  });
});

// Configuration de Swagger UI avec sécurité
const swaggerUIOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0; }
    .swagger-ui .info .title { color: #3b4151; }
  `,
  customSiteTitle: `API Docs - ${process.env.NODE_ENV?.toUpperCase() || "DEV"}`,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true, // Permet de filtrer les endpoints
    tryItOutEnabled: process.env.NODE_ENV !== "production", // Désactive "Try it out" en prod
  },
  customJs:
    process.env.NODE_ENV === "production"
      ? [
          // Script personnalisé pour ajouter des avertissements en production
          "/swagger-custom.js",
        ]
      : [],
};

// Application de la sécurité à Swagger
app.use(
  "/api-docs",
  swaggerRateLimit,
  swaggerSecurity,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUIOptions)
);

// Script personnalisé pour l'interface Swagger en production
app.get("/swagger-custom.js", (req, res) => {
  res.type("application/javascript");
  res.send(`
    window.onload = function() {
      // Ajouter un avertissement en production
      const info = document.querySelector('.swagger-ui .info');
      if (info) {
        const warning = document.createElement('div');
        warning.style.cssText = 'background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px; color: #856404;';
        warning.innerHTML = '<strong>⚠️ Environnement de Production</strong><br>Cette documentation est protégée. Utilisez avec précaution.';
        info.parentNode.insertBefore(warning, info);
      }
    }
  `);
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.message);
  res.status(500).json({
    error: "Erreur interne du serveur",
    message:
      process.env.NODE_ENV === "production"
        ? "Une erreur est survenue"
        : err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📖 Documentation: http://localhost:${PORT}/api-docs`);

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `🔐 Documentation protégée - Utilisateur: ${process.env.SWAGGER_USERNAME}`
    );
  } else {
    console.log(`⚠️  Mode développement - Documentation non protégée`);
  }
});

export default app;
