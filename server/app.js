// app.js
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";

// Initialize express app
const app = express();

// Import loaders
import {
  configureExpress,
  configureLogging,
  configureSecurity,
  configureRoutes,
  configureErrorHandlers,
} from "./loaders/index.js";

// Import and apply CORS
import configureCORS from "./config/cors.js";
app.use(configureCORS());

// Configure Express
configureExpress(app);

// Logging
configureLogging(app);

// Security (NO CORS here anymore!)
configureSecurity(app);

// API Routes
configureRoutes(app);

// Global error handlers
configureErrorHandlers(app);

export default app;
