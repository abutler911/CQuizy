import express from "express";
import questionRoutes from "./questionRoutes.js";
import healthRoutes from "./healthRoutes.js";
import csrfRoutes from "./csrfRoutes.js";
import { setupSecurity } from "../../../config/security.js";

const router = express.Router();
const { csrfProtection } = setupSecurity(express());

// Public routes (no CSRF protection)
router.use("/health", healthRoutes);

// Read-only question routes (no CSRF protection)
const publicRouter = express.Router();
publicRouter.get("/", (req, res, next) => {
  req.method = "GET"; // Ensure only GET requests
  questionRoutes(req, res, next);
});
router.use("/questions/public", publicRouter);

// Protected routes (with CSRF protection)
router.use("/csrf-token", csrfProtection, csrfRoutes);
router.use("/questions", csrfProtection, questionRoutes);

export default router;
