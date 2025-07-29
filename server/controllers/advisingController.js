const Advising = require('../models/Advising');
const User = require('../models/User');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const { sendAdvisingRequestEmail, sendAdvisingStatusUpdateEmail } = require('../utils/sendEmail');

// @desc    Create advising request
// @route   POST /api/advising
// @access  Private (Student)
exports.createAdvisingRequest = asyncHandler(async (req, res, next) => {
  const { reason, additionalInfo, preferredDays, preferredTimeRange } = req.body;

  // Validate required fields
  if (!reason) {
    return next(new ErrorResponse('Please provide a reason for the advising request', 400));
  }

  // Validate preferred days format if provided
  if (preferredDays && (!Array.isArray(preferredDays) || preferredDays.some(day => !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(day)))) {
    return next(new ErrorResponse('Invalid preferred days format', 400));
  }

  // Validate time range format if provided
  if (preferredTimeRange && (
    !preferredTimeRange.start || 
    !preferredTimeRange.end ||
    !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(preferredTimeRange.start) ||
    !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(preferredTimeRange.end)
  )) {
    return next(new ErrorResponse('Invalid time range format (use HH:MM)', 400));
  }

  const advising = await Advising.create({
    user: req.user._id,
    reason,
    additionalInfo,
    preferredDays,
    preferredTimeRange,
    status: 'Pending'
  });

  // Send notification email to admin
  await sendAdvisingRequestEmail(advising, req.user);

  res.status(201).json({ 
    success: true, 
    data: await advising.populate('user', 'name email') 
  });
});

// @desc    Get all advising requests
// @route   GET /api/advising
// @access  Private (Admin/Advisor)
exports.getAllAdvisingRequests = asyncHandler(async (req, res, next) => {
  // Build filter based on user role and query params
  const filter = {};
  
  // For advisors, only show requests assigned to them or unassigned
  if (req.user.role === 'advisor') {
    filter.$or = [
      { advisor: req.user._id },
      { advisor: { $exists: false } },
      { advisor: null }
    ];
  }

  // Filter by status if provided
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by student if provided (admin only)
  if (req.query.studentId && req.user.role === 'admin') {
    filter.user = req.query.studentId;
  }

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
  const filter = { status: 'Pending' };
  
  // For advisors, only show unassigned requests
  if (req.user.role === 'advisor') {
    filter.$or = [
      { advisor: { $exists: false } },
      { advisor: null }
    ];
  }

  const requests = await Advising.find(filter)
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

// @desc    Get advisor's pending requests
// @route   GET /api/advising/my-pending
// @access  Private (Advisor)
exports.getAdvisorPendingRequests = asyncHandler(async (req, res, next) => {
  const requests = await Advising.find({ 
    advisor: req.user._id,
    status: 'Assigned'
  })
    .populate('user', 'name email')
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

  // Authorization check
  if (req.user.role === 'student' && !request.user._id.equals(req.user._id)) {
    return next(new ErrorResponse('Not authorized to access this request', 403));
  }

  // Advisor can only access their assigned requests
  if (req.user.role === 'advisor' && request.advisor && !request.advisor._id.equals(req.user._id)) {
    return next(new ErrorResponse('Not authorized to access this request', 403));
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
  
  // Validate advisor exists and is actually an advisor
  const advisor = await User.findOne({ _id: advisorId, role: 'advisor' });
  if (!advisor) {
    return next(new ErrorResponse('Invalid advisor ID', 400));
  }

  const advisingRequest = await Advising.findById(req.params.id);
  if (!advisingRequest) {
    return next(new ErrorResponse(`Advising request not found with id of ${req.params.id}`, 404));
  }

  // Check if request is already assigned
  if (advisingRequest.status !== 'Pending') {
    return next(new ErrorResponse('Request has already been processed', 400));
  }

  // Update request
  advisingRequest.advisor = advisorId;
  advisingRequest.status = 'Assigned';
  advisingRequest.notes = notes;
  advisingRequest.updatedAt = Date.now();

  await advisingRequest.save();

  // Send notification to student
  await sendAdvisingStatusUpdateEmail(advisingRequest, 'assigned');

  res.status(200).json({
    success: true,
    data: await advisingRequest.populate('advisor', 'name email')
  });
});

// @desc    Update advising request status
// @route   PATCH /api/advising/:id/status
// @access  Private (Admin/Advisor)
exports.updateRequestStatus = asyncHandler(async (req, res, next) => {
  const { status, notes } = req.body;
  const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('Invalid status value', 400));
  }

  const advisingRequest = await Advising.findById(req.params.id);
  if (!advisingRequest) {
    return next(new ErrorResponse(`Advising request not found with id of ${req.params.id}`, 404));
  }

  // Authorization check - only assigned advisor or admin can update
  if (req.user.role === 'advisor' && 
      (!advisingRequest.advisor || !advisingRequest.advisor.equals(req.user._id))) {
    return next(new ErrorResponse('Not authorized to update this request', 403));
  }

  // Update request
  advisingRequest.status = status;
  advisingRequest.notes = notes || advisingRequest.notes;
  advisingRequest.updatedAt = Date.now();

  await advisingRequest.save();

  // Send notification to student if status changed to completed or cancelled
  if (['Completed', 'Cancelled'].includes(status)) {
    await sendAdvisingStatusUpdateEmail(advisingRequest, status.toLowerCase());
  }

  res.status(200).json({
    success: true,
    data: await advisingRequest.populate('advisor', 'name email')
  });
});

// @desc    Delete an advising request
// @route   DELETE /api/advising/:id
// @access  Private (Admin/Student)
exports.deleteAdvisingRequest = asyncHandler(async (req, res, next) => {
  const advisingRequest = await Advising.findById(req.params.id);

  if (!advisingRequest) {
    return next(new ErrorResponse(`Advising request not found with id of ${req.params.id}`, 404));
  }

  // Authorization - students can only delete their own pending requests
  if (req.user.role === 'student') {
    if (!advisingRequest.user.equals(req.user._id)) {
      return next(new ErrorResponse('Not authorized to delete this request', 403));
    }
    if (advisingRequest.status !== 'Pending') {
      return next(new ErrorResponse('Only pending requests can be deleted', 400));
    }
  }

  await Advising.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {},
    message: 'Advising request deleted successfully'
  });
});