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

  // CORS configuration for Express 4
  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma'
    ]
  };

  app.use(cors(corsOptions));

  // Handle preflight requests
  app.options('*', cors(corsOptions));

  app.use(logger("dev"));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));

  // Connect to database
  connectDB(process.env.MONGO_URI);

  // Test route
  app.get('/api/test', (req, res) => {
    res.json({ 
      success: true, 
      message: 'Express 4 server is working!',
      timestamp: new Date().toISOString(),
      version: '4.x'
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/notifications", notifications);
  app.use("/api/courses", courseRoutes);
  app.use("/api/advising", advisingRoutes);
  app.use("/api/appointments", appointmentsRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/registrations", registrationRoute);
  app.use("/api/recommendations", recommendationRoute);
  app.use("/api/chats", chatRoutes);

  // Static file serving
  app.use("/public", express.static(path.join(__dirname, "public")));

  // Production static files
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "client", "dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
    });
  }

  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`
    });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT} with Express 4`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 Test URL: http://localhost:${PORT}/api/test`);
  console.log(`🔗 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

module.exports = app;