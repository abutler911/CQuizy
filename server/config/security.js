import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import session from "express-session";
import MongoStore from "connect-mongo";
import environment from "./environment.js";

export const setupSecurity = (app) => {
  // Cookie parser
  app.use(cookieParser(environment.cookieSecret));

  // Session configuration with MongoDB store
  app.use(
    session({
      secret: environment.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: environment.mongoUri,
        collectionName: "sessions",
        autoRemove: "interval",
        autoRemoveInterval: 10, // Clear expired sessions every 10 minutes
      }),
      cookie: {
        secure: environment.isProduction,
        httpOnly: true,
        sameSite: environment.isProduction ? "strict" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Helmet security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: [
            "'self'",
            ...environment.allowedOrigins.map((origin) =>
              origin.startsWith("http") ? origin : `https://${origin}`
            ),
          ],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: { policy: "require-corp" },
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "same-origin" },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: "deny" },
      hsts: {
        maxAge: 15552000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      xssFilter: true,
      noSniff: true,
    })
  );

  // CSRF Protection
  const csrfProtection = csrf({
    cookie: {
      key: "_csrf",
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 3600,
    },
  });

  return { csrfProtection };
};

export default setupSecurity;
