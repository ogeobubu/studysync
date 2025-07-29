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

dotenv.config();

const createApp = () => {
  const app = express();

  app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  connectDB(process.env.MONGO_URI);

  app.use("/api/auth", authRoutes);
  app.use("/api/notifications", notifications);
  app.use("/api/courses", courseRoutes);
  app.use("/api/advising", advisingRoutes);
  app.use("/api/appointments", appointmentsRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/registrations", registrationRoute);
  app.use("/api/recommendations", recommendationRoute);
  app.use("/api/chats", chatRoutes);

  app.use("/public", express.static(path.join(__dirname, "public")));

  if (process.env.NODE_ENV === "production") {
    // Serve static files from client
    app.use(express.static(path.join(__dirname, "..", "client", "dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "..", "client", "dist", "index.html"));
    });
  }

app.use((err, req, res, next) => {
  if (err.message.includes('path-to-regexp')) {
    console.error('Invalid route path detected');
    return res.status(500).json({ error: 'Server configuration error' });
  }
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

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});