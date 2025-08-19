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
const seedCourses = require('./seedCourses'); // expects exported function
const dotenv = require("dotenv");

dotenv.config();

const createApp = () => {
  const app = express();

  app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
    if (err && err.message && err.message.includes('path-to-regexp')) {
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

async function start() {
  try {
    // Connect DB and wait till connected
    await connectDB(process.env.MONGO_URI);

    // Automatically seed courses on startup.
    // By default seeding only runs when courses collection is empty.
    // To force reseed (CAUTION): set FORCE_SEED=true in your .env
    try {
      const force = process.env.FORCE_SEED === 'true';
      const seedResult = await seedCourses({ useExistingConnection: true, force });
      if (seedResult && seedResult.skipped) {
        console.log('Seeding skipped (existing data).');
      } else {
        console.log('Seeding done on startup.');
      }
    } catch (seedErr) {
      // Log but don't crash the whole app. Remove this if you want startup to fail on seeding error.
      console.error('Seeding failed on startup:', seedErr);
    }

    // Start listening AFTER seeding attempt
    app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
}

start();