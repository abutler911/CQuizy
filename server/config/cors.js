import cors from "cors";
import environment from "./environment.js";

export const configureCORS = () => {
  const allowedOrigins = [
    "https://cquizy.com",
    "https://www.cquizy.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "https://cquizy-client.netlify.app",
  ];

  return cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
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
    ],
    optionsSuccessStatus: 200,
  });
};

export default configureCORS;
