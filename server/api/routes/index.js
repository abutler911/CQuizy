import express from "express";
import v1Router from "./v1/index.js";

const apiRouter = express.Router();

// Mount v1 routes
apiRouter.use("/v1", v1Router);

export { apiRouter };
