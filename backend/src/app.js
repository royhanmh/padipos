import cors from "cors";
import express from "express";
import { sequelize } from "./models/index.js";
import { databaseHost } from "./database.js";
import routes from "./routes/index.js";

const FRONTEND_ORIGIN =
  (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173").replace(/\/$/, "");

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: FRONTEND_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "12mb" }));
  app.use(express.urlencoded({ limit: "12mb", extended: true }));
  app.use(express.static("public"));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "pos-sederhana-backend",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", routes);

  app.use((err, _req, res, _next) => {
    console.error(err);
    const status = err.status || 500;
    const isServerError = status >= 500;

    res.status(err.status || 500).json({
      error: {
        message: isServerError
          ? "Internal Server Error"
          : err.message || "Request failed.",
        status,
      },
    });
  });

  return app;
};

export const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established");

    const app = createApp();
    const port = Number(process.env.PORT) || 4000;

    app.listen(port, () => {
      console.log(`POS Sederhana backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    const code = error?.parent?.code ?? error?.original?.code;
    const name = error?.name ?? "";

    if (code === "ENOTFOUND" || name === "SequelizeHostNotFoundError") {
      console.error(
        `Error starting server: database host not found (${databaseHost}).`,
      );
      console.error(
        "Check backend/.env DATABASE_URL host and ensure local .env overrides machine-level DATABASE_URL.",
      );
    }

    console.error("Error starting server:", error);
    process.exit(1);
  }
};

const app = createApp();

export default app;


