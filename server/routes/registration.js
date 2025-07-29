// routes/registrationRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerCourse,
  updateGrade,
  getStudentRegistrations,
} = require("../controllers/registrationController");

// Base URL: /api/v1/registrations

// Student routes
router.get("/student/:id", getStudentRegistrations);
router.post("/", registerCourse);

// Admin routes
router.put("/:id/grade", updateGrade);

module.exports = router;
