const express = require("express");
const router = express.Router();
const {
  createAppointment,
  scheduleAppointment,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/", protect, authorize("student"), createAppointment);
router.post("/schedule", protect, authorize("advisor"), scheduleAppointment);

module.exports = router;