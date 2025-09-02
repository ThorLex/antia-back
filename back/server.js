import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { swaggerOptions } from "./swaggerOption.js";
import {
  setupSwaggerSecurity,
  swaggerRateLimit,
  swaggerUIOptions,
} from "./config/swaggerSecurity.js";
import { IpFilter } from "express-ipfilter";

const app = express();
app.use(helmet());
app.set("trust proxy", 1);
const swaggerSecurity = setupSwaggerSecurity();
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin: [
    "http://localhost:4000", // Localhost for development
    "https://signalcam.onrender.com", // Production server
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-provider"],
};
let grant;

app.use(cors(corsOptions));

const allowedIPs = [
  "127.0.0.1", // Localhost
  "::1", // IPv6 Localhost
  "*.vercel.app", // Replace with your Vercel domain
  "your-custom-domain.com", // Replace with your custom domain if applicable
];

app.use(IpFilter(allowedIPs, { mode: "allow" }));

// Remove token protection for /api-docs and /api/docs-info
// All documentation routes are now public

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
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      authAction: {
        BearerAuth: {
          name: "Authorization",
          schema: {
            type: "http",
            in: "header",
            name: "Authorization",
            description:
              "Enter your Bearer token in the format: Bearer <token>",
          },
          value: "Bearer your-valid-token", // Replace with a valid token
        },
      },
    },
  })
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
  console.log(`📖 Documentation: ${process.env.PROXY}:${PORT}/api-docs`);

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `🔐 Documentation protégée - Utilisateur: ${process.env.SWAGGER_USERNAME}`
    );
  } else {
    console.log(`⚠️  Mode développement - Documentation non protégée`);
  }
});

export default app;
