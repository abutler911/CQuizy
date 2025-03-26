import express from "express";
import { apiRouter } from "../api/routes/index.js";
import { setupSwagger } from "../config/swagger.js";
import { apiLimiter } from "../api/middlewares/rateLimiter.js";

export default (app) => {
  // Setup Swagger documentation
  setupSwagger(app);

  // Welcome route with more informative response
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to the CQuizy API",
      version: "v1",
      status: "operational",
      documentation: "/api-docs",
    });
  });

  // API routes with versioning and rate limiting
  app.use("/api", apiLimiter, apiRouter);

  // Catch-all route for debugging
  app.use((req, res) => {
    res.status(404).json({
      error: "Route not found",
      requestedUrl: req.originalUrl,
      method: req.method,
      availableRoutes: [
        "/api/v1/questions",
        "/api/v1/health",
        "/api/v1/csrf-token",
      ],
    });
  });

  return app;
};
