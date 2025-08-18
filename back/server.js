import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { swaggerOptions } from "./swaggerOption.js";
import {
  setupSwaggerSecurity,
  swaggerRateLimit,
  swaggerUIOptions,
} from "./config/swaggerSecurity.js";

const app = express();
app.use(helmet());

const swaggerSecurity = setupSwaggerSecurity();
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(express.json());

app.get("/api/docs-info", (req, res) => {
  const isProduction = process.env.NODE_ENV === "PROD";
  res.json({
    documentation: "/api-docs",
    protected: isProduction,
    environment: process.env.NODE_ENV || "development",
    message: isProduction
      ? "Documentation protégée par authentification"
      : "Documentation accessible en mode développement",
  });
});

app.use(
  "/api-docs",
  swaggerRateLimit,
  swaggerSecurity,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUIOptions)
);

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
  console.log(`🚀 Serveur démarré`);
  console.log(`📖 Documentation: ${process.env.PROXY}${PORT}/api-docs`);

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `🔐 Documentation protégée - Utilisateur: ${process.env.SWAGGER_USERNAME}`
    );
  } else {
    console.log(`⚠️  Mode développement - Documentation non protégée`);
  }
});

export default app;
