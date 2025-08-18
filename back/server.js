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

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const provider = req.headers["x-provider"];

  // Allow unrestricted access to Swagger documentation routes
  if (req.path.startsWith("/api-docs")) {
    if (authHeader && authHeader === "Bearer swagger") {
      req.accessLevel = "swagger"; // Grant Swagger access
      return next();
    }
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  // Check for superkey (admin access)
  if (token === process.env.SUPER_KEY) {
    req.accessLevel = "admin"; // Grant admin access
    return next();
  }

  // Check for client key (user access)
  if (!provider) {
    return res.status(401).json({ message: "Unauthorized: Missing provider" });
  }

  if (token === process.env.CLIENT_KEY && provider === "your-provider") {
    req.accessLevel = "user"; // Grant user access
    return next();
  }

  return res
    .status(403)
    .json({ message: "Forbidden: Invalid token or provider" });
});

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
