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

// Configure Express
configureExpress(app);

// Configure Logging
configureLogging(app);

// Configure Security
configureSecurity(app);

// Configure Routes
configureRoutes(app);

// Configure Error Handlers
configureErrorHandlers(app);

export default app;
