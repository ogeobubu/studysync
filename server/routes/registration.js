// routes/registrationRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerCourse,
  updateGrade,
  getStudentRegistrations,
} = require("../controllers/registrationController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Base URL: /api/v1/registrations

// Student routes
router.get("/student/:id", protect, getStudentRegistrations);
router.post("/", protect, registerCourse);

// Admin routes
router.put("/:id/grade", protect, authorize("student"), updateGrade);

module.exports = router;
