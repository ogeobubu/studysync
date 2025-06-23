const Appointment = require("../models/Appointment");
const Advising = require("../models/Advising"); // Ensure Advising model is imported
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse"); // Ensure ErrorResponse is imported

// @desc    Create an appointment by a student
// @route   POST /api/appointments
// @access  Private (Student)
exports.createAppointment = asyncHandler(async (req, res, next) => {
  const { title, date, time } = req.body;

  // Create a new appointment for the logged-in student
  const appointment = await Appointment.create({
    user: req.user._id,
    title,
    date,
    time,
  });

  res.status(201).json({ success: true, data: appointment });
});

// @desc    Schedule an appointment for a student by an advisor
// @route   POST /api/appointments/schedule
// @access  Private (Advisor)
exports.scheduleAppointment = asyncHandler(async (req, res, next) => {
  const { advisingId, title, date, time } = req.body;

  // Find the advising request to validate it belongs to the advisor
  const advisingRequest = await Advising.findById(advisingId);

  if (!advisingRequest || advisingRequest.advisor.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("You are not authorized to schedule this appointment", 403));
  }

  // Create a new appointment for the student associated with the advising request
  const appointment = await Appointment.create({
    user: advisingRequest.user, // Assign to the student
    title,
    date,
    time,
  });

  res.status(201).json({ success: true, data: appointment });
});