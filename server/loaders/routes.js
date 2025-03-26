import express from "express";
import { apiRouter } from "../api/routes/index.js";
import { setupSwagger } from "../config/swagger.js";
import { apiLimiter } from "../api/middlewares/rateLimiter.js";

export default (app) => {
  // Setup Swagger documentation
  setupSwagger(app);

  // Welcome route
  app.get("/", (req, res) => {
    res.send("Welcome to the CQuizy API");
  });

  // API routes with versioning and rate limiting
  app.use("/api", apiLimiter, apiRouter);

  return app;
};
