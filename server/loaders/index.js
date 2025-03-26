import expressLoader from "./express.js";
import mongooseLoader from "./mongoose.js";
import loggerLoader from "./logger.js";
import securityLoader from "./security.js";
import routesLoader from "./routes.js";
import errorHandlersLoader from "./errorHandlers.js";

export const configureExpress = (app) => expressLoader(app);
export const configureDatabase = async () => await mongooseLoader();
export const configureLogging = () => loggerLoader();
export const configureSecurity = (app) => securityLoader(app);
export const configureRoutes = (app) => routesLoader(app);
export const configureErrorHandlers = (app) => errorHandlersLoader(app);
