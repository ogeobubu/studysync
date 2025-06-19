const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('student'), createAppointment);
router.get('/', protect, authorize('student'), getAppointments);

module.exports = router;