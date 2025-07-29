const express = require("express");
const router = express.Router();
const {
  createAppointment,
  scheduleAppointment,
} = require("../controllers/appointmentController");

router.post("/", createAppointment);
router.post("/schedule", scheduleAppointment);

module.exports = router;