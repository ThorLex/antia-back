import rateLimit from "express-rate-limit";
import basicAuth from "express-basic-auth";
export const swaggerUIOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0; }
    .swagger-ui .info .title { color: #303030ff; }
  `,
  customSiteTitle: `API Docs - ${process.env.NODE_ENV?.toUpperCase() || "DEV"}`,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: process.env.NODE_ENV !== "production",
  },
  customJs: process.env.NODE_ENV === "production" ? ["/swagger-custom.js"] : [],
};

export const swaggerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requêtes par IP toutes les 15 minutes
  message: {
    error: "Trop de tentatives d'accès à la documentation",
    retryAfter: "15 minutes",
  },
  skip: (req) => process.env.NODE_ENV === "production",
});

export const setupSwaggerSecurity = () => {
  const isProduction = process.env.NODE_ENV == "PROD";

  if (!isProduction) {
    console.log("⚠️  Mode développement - Documentation Swagger non protégée");
    return (req, res, next) => next();
  }
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
