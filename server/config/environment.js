import crypto from "crypto";

export const environment = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  cookieSecret:
    process.env.COOKIE_SECRET || crypto.randomBytes(64).toString("hex"),
  sessionSecret:
    process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex"),
  version: process.env.npm_package_version || "unknown",
  allowedOrigins: [
    "https://cquizy.com",
    "https://www.cquizy.com",
    "http://cquizy.com",
    "http://www.cquizy.com",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
};

export default environment;
