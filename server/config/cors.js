import cors from "cors";
import environment from "./environment.js";

export const configureCORS = () => {
  const isDev = environment.nodeEnv !== "production";

  const allowedOrigins = [
    "https://cquizy.com",
    "https://www.cquizy.com",
    "https://cquizy.netlify.app",
  ];

  if (isDev) {
    allowedOrigins.push("http://localhost:5173");
  }

  console.log("✅ CORS middleware configured for:", allowedOrigins);

  return cors({
    origin: (origin, callback) => {
      console.log("🌍 Incoming CORS request from origin:", origin);

      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) => origin === allowed);

      if (isAllowed) {
        console.log("✅ Origin allowed:", origin);
        callback(null, true);
      } else {
        console.warn("❌ Origin blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "X-CSRF-Token",
    ],
    optionsSuccessStatus: 200,
  });
};

export default configureCORS;
