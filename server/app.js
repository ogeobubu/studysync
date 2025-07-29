const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const logger = require("morgan");
const errorHandler = require("./middlewares/error");
const authRoutes = require("./routes/auth");
const notifications = require("./routes/notifications");
const courseRoutes = require("./routes/courseRoutes");
const advisingRoutes = require("./routes/advising");
const appointmentsRoutes = require("./routes/appointments");
const userRoutes = require("./routes/user");
const registrationRoute = require("./routes/registration");
const recommendationRoute = require("./routes/recommendations");
const chatRoutes = require("./routes/chatRoutes");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

const createApp = () => {
  const app = express();

    // Add this right after your express() initialization
const originalUse = app.use;
app.use = function(path, ...args) {
  if (typeof path === 'string' && (path.startsWith('http://') || path.startsWith('https://'))) {
    throw new Error(`Invalid route path: ${path} - Express routes must be paths, not full URLs`);
  }
  return originalUse.call(this, path, ...args);
};

  // Enhanced CORS configuration
  app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  // Logging
  app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Connect to database
  connectDB(process.env.MONGO_URI);

  // Debug code - remove after fixing
console.log('All routes being registered:');
const routes = [
  authRoutes, notifications, courseRoutes, advisingRoutes, 
  appointmentsRoutes, userRoutes, registrationRoute, 
  recommendationRoute, chatRoutes
];
routes.forEach(router => {
  console.log(router.stack.map(layer => layer.route?.path));
});

  // API Routes - ensure none of these route paths contain full URLs
  app.use("/api/auth", authRoutes);
  app.use("/api/notifications", notifications);
  app.use("/api/courses", courseRoutes);
  app.use("/api/advising", advisingRoutes);
  app.use("/api/appointments", appointmentsRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/registrations", registrationRoute);
  app.use("/api/recommendations", recommendationRoute);
  app.use("/api/chats", chatRoutes);

  // Static files
  app.use("/public", express.static(path.join(__dirname, "public")));

  // Production configuration
  if (process.env.NODE_ENV === "production") {
    // Serve static files from client
    app.use(express.static(path.join(__dirname, "..", "client", "dist")));

    // Handle SPA routing - must come after all other routes
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "..", "client", "dist", "index.html"));
    });
  }

  // Error handling - must be last middleware
// Replace your current error handler with:
app.use((err, req, res, next) => {
  if (err.message.includes('path-to-regexp')) {
    console.error('Invalid route path detected');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  // Your existing error handling
  errorHandler(err, req, res, next);
});

  return app;
};

const app = createApp();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});