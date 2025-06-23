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

  app.use(cors());
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Connect to database
  connectDB(process.env.MONGO_URI);

  // Routes
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
    const path = require("path");
    app.use(express.static(path.join(__dirname, "..", "client", "dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
    });
  }
  app.use(errorHandler);

  return app;
};

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
