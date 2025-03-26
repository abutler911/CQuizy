import cors from "cors";

export const configureCORS = () => {
  const allowedOrigins = [
    "https://cquizy.com",
    "https://www.cquizy.com",
    "https://cquizy-client.netlify.app",
    "http://localhost:5173",
  ];

  return cors({
    origin: (origin, callback) => {
      console.log("🌍 Incoming CORS request from origin:", origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        console.log("✅ Origin allowed:", origin);
        return callback(null, true);
      } else {
        console.warn("❌ Origin NOT allowed by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
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
