import cors from "cors";
import express from "express";
import helmet from "helmet";
import indexRoutes from "./routes/index.js";
import mongoose from "mongoose";

const app = express();
app.use(helmet());
app.set("trust proxy", 1);
app.use(express.json());
//  MONGO_URI
const MONGO_URI = process.env.MONGO_URI;
// Configure CORS

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-provider"],
};

app.use(cors(corsOptions));

app.use("/api", indexRoutes);

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
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to INTIADB MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Serveur démarré`);
});

export default app;
