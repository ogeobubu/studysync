const Advising = require('../models/Advising');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create advising request
// @route   POST /api/advising
// @access  Private (Student)
exports.createAdvisingRequest = asyncHandler(async (req, res, next) => {
  const { reason, additionalInfo, preferredDay, preferredTime } = req.body;

  const advising = await Advising.create({
    user: req.user._id,
    reason,
    additionalInfo,
    preferredDay,
    preferredTime
  });

  res.status(201).json({ success: true, data: advising });
});

// @desc    Get all advising requests (for advisors)
// @route   GET /api/advising
// @access  Private (Advisor)
exports.getAllAdvisingRequests = asyncHandler(async (req, res, next) => {
  const requests = await Advising.find().populate('user', 'name email');
  res.status(200).json({ success: true, count: requests.length, data: requests });
});

// @desc    Get all advising requests for the logged-in student
// @route   GET /api/advising/my
// @access  Private (Student)
exports.getStudentAdvisingRequests = asyncHandler(async (req, res, next) => {
  // Ensure the user exists
  if (!req.user || !req.user._id) {
    return next(new ErrorResponse('Unauthorized access: user not found', 401));
  }

  try {
    const requests = await Advising.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching advising requests:', error);
    return next(new ErrorResponse('Failed to fetch advising requests', 500));
  }
});
