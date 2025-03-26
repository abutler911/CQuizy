// loaders/configureExpress.js
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors"; // 👈 import CORS

export default (app) => {
  // Set trust proxy
  app.set("trust proxy", 1);

  // Apply compression middleware
  app.use(compression());

  // ✅ Add CORS middleware
  app.use(
    cors({
      origin: "http://localhost:5173", // Or use an array if needed
      credentials: true,
    })
  );

  // Parse request bodies
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic route for favicon to avoid 404 errors
  app.get("/favicon.ico", (req, res) => res.status(204).end());

  return app;
};
