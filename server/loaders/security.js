import { setupSecurity } from "../config/security.js";

export default (app) => {
  const { csrfProtection } = setupSecurity(app);
  app.locals.csrfProtection = csrfProtection;
  return app;
};
