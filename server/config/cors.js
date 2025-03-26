import cors from "cors";
import environment from "./environment.js";

// Function to dynamically set CORS options
export const configureCORS = () => {
  // Define all potential origins, including production and development
  const allowedOrigins = [
    "https://cquizy.com",
    "https://www.cquizy.com",
    "http://localhost:5173", // Vite dev server
    "http://localhost:3000", // Express server
    "https://cquizy-client.netlify.app", // Replace with your actual Netlify URL
  ];

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
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
