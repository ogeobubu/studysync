// routes/registration.js
const express = require("express");
const router = express.Router();
const {
  registerCourse,
  updateGrade,
  getStudentRegistrations,
} = require("../controllers/registrationController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Base URL: /api/registrations

// Student routes - specific routes first
router.get("/student/:id", protect, getStudentRegistrations);
router.post("/", protect, authorize("student"), registerCourse);

// Admin routes - parameterized routes last
router.put("/:id/grade", protect, authorize("admin"), updateGrade); // Fixed: should be admin, not student

module.exports = router;