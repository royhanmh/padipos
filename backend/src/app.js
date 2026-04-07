import cors from "cors";
import express from "express";
import { sequelize } from "./models/index.js";
import routes from "./routes/index.js";
import { prepareSchema } from "./prepareSchema.js";

const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: FRONTEND_ORIGIN,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
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
    res.status(err.status || 500).json({
      error: {
        message: err.message || "Internal Server Error",
        status: err.status || 500,
      },
    });
  });

  return app;
};

export const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established");

    await prepareSchema();
    await sequelize.sync({ alter: true });
    console.log("Database synced");

    const app = createApp();
    const port = Number(process.env.PORT) || 4000;

    app.listen(port, () => {
      console.log(`POS Sederhana backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

const app = createApp();

export default app;


