const Appointment = require('../models/Appointment');
const asyncHandler = require('../middlewares/async');

// @desc    Create an appointment
// @route   POST /api/appointments
// @access  Private (Student)
exports.createAppointment = asyncHandler(async (req, res, next) => {
  const { title, date, time } = req.body;

  const appointment = await Appointment.create({
    user: req.user._id,
    title,
    date,
    time
  });

  res.status(201).json({ success: true, data: appointment });
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Student)
exports.getAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find({ user: req.user._id });
  res.status(200).json({ success: true, count: appointments.length, data: appointments });
});