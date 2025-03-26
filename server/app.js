// app.js
import express from "express";

// Initialize express app
const app = express();

import configureCORS from "./config/cors.js";
app.use(configureCORS());

// Loaders
import {
  configureExpress,
  configureLogging,
  configureSecurity,
  configureRoutes,
  configureErrorHandlers,
} from "./loaders/index.js";

// Middleware stack
configureExpress(app);
configureLogging(app);
configureSecurity(app);
configureRoutes(app);
configureErrorHandlers(app);

export default app;
