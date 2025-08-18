import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "Documentation for your Node.js API",
      contact: {
        name: "thorlex",
        email: "beyasbekono@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.PROXY,
        description: "Production server",
      },
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server/Testing server",
      },
    ],
    tags: [
      {
        name: "History",
        description: "Operations related to history entries",
      },
      {
        name: "Notifications",
        description: "Operations related to user notifications",
      },
      {
        name: "Reports",
        description: "Operations related to reports",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "./routes/*.js"),
    path.join(__dirname, "./controllers/*.js"),
    path.join(__dirname, "./server.js"),
    // Ou si vous utilisez TypeScript:
    // path.join(__dirname, "./routes/*.ts"),
    // path.join(__dirname, "./controllers/*.ts"),
  ],
};
