const Advising = require('../models/Advising');
const User = require('../models/User');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create advising request
// @route   POST /api/advising
// @access  Private (Student)
exports.createAdvisingRequest = asyncHandler(async (req, res, next) => {
  const { reason, additionalInfo, preferredDay, preferredTime } = req.body;

  // Validate required fields
  if (!reason) {
    return next(new ErrorResponse('Please provide a reason for the advising request', 400));
  }

  const advising = await Advising.create({
    user: req.user._id,
    reason,
    additionalInfo,
    preferredDay,
    preferredTime,
    status: 'Pending'
  });

  res.status(201).json({ 
    success: true, 
    data: await advising.populate('user', 'name email') 
  });
});

// @desc    Get all advising requests
// @route   GET /api/advising
// @access  Private (Admin/Advisor)
exports.getAllAdvisingRequests = asyncHandler(async (req, res, next) => {
  // Filter by status if query parameter exists
  const filter = req.query.status ? { status: req.query.status } : {};
  
  const requests = await Advising.find(filter)
    .populate('user', 'name email')
    .populate('advisor', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ 
    success: true, 
    count: requests.length, 
    data: requests 
  });
});

// @desc    Get pending advising requests (for dashboard)
// @route   GET /api/advising/pending
// @access  Private (Admin/Advisor)
exports.getPendingRequests = asyncHandler(async (req, res, next) => {
  const requests = await Advising.find({ status: 'Pending' })
    .populate('user', 'name email')
    .select('-additionalInfo')
    .limit(10)
    .sort({ createdAt: -1 });

  res.status(200).json({ 
    success: true, 
    count: requests.length, 
    data: requests 
  });
});

// @desc    Get single advising request
// @route   GET /api/advising/:id
// @access  Private
exports.getRequestById = asyncHandler(async (req, res, next) => {
  const request = await Advising.findById(req.params.id)
    .populate('user', 'name email')
    .populate('advisor', 'name email');

  if (!request) {
    return next(new ErrorResponse(`Request not found with id of ${req.params.id}`, 404));
  }

  // Check if user is authorized to view this request
  if (req.user.role === 'student' && !request.user._id.equals(req.user._id)) {
    return next(new ErrorResponse('Not authorized to access this request', 401));
  }

  res.status(200).json({ 
    success: true, 
    data: request 
  });
});

// @desc    Get all advising requests for the logged-in student
// @route   GET /api/advising/my
// @access  Private (Student)
exports.getStudentAdvisingRequests = asyncHandler(async (req, res, next) => {
  const requests = await Advising.find({ user: req.user._id })
    .populate('advisor', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

// @desc    Assign an advisor to an advising request
// @route   PATCH /api/advising/:id/assign
// @access  Private (Admin/Advisor)
exports.assignAdvisor = asyncHandler(async (req, res, next) => {
  const { advisorId, notes } = req.body;
  
  // Validate advisor exists
  const advisor = await User.findById(advisorId);
  if (!advisor || advisor.role !== 'advisor') {
    return next(new ErrorResponse('Invalid advisor ID', 400));
  }

  const advisingRequest = await Advising.findById(req.params.id);
  if (!advisingRequest) {
    return next(new ErrorResponse(`Advising request not found with id of ${req.params.id}`, 404));
  }

  // Update request
  advisingRequest.advisor = advisorId;
  advisingRequest.status = 'Assigned';
  advisingRequest.notes = notes;
  advisingRequest.updatedAt = Date.now();

  await advisingRequest.save();

  res.status(200).json({
    success: true,
    data: await advisingRequest.populate('advisor', 'name email')
  });
});

// @desc    Delete an advising request
// @route   DELETE /api/advising/:id
// @access  Private (Admin)
exports.deleteAdvisingRequest = asyncHandler(async (req, res, next) => {
  const advisingRequest = await Advising.findById(req.params.id);

  if (!advisingRequest) {
    return next(new ErrorResponse(`Advising request not found with id of ${req.params.id}`, 404));
  }

  await Advising.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {},
    message: 'Advising request deleted successfully'
  });
});