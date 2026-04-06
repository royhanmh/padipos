import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

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

  return app;
};

const app = createApp();

export default app;
