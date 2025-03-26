import {
  notFoundHandler,
  csrfErrorHandler,
  errorHandler,
} from "../api/middlewares/errorHandler.js";

export default (app) => {
  // Handle 404 errors
  app.all("*", notFoundHandler);

  // Handle CSRF errors
  app.use(csrfErrorHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};
