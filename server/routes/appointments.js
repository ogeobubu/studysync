const express = require("express");
const router = express.Router();
const {
  createAppointment,
  scheduleAppointment,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Route for students to create an appointment
router.post("/", protect, authorize("student"), createAppointment);

// Route for advisors to schedule an appointment based on an advising request
router.post("/schedule", protect, authorize("advisor"), scheduleAppointment);

module.exports = router;