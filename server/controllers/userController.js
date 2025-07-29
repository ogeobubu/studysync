const User = require('../models/User');
const Advising = require('../models/Advising');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { 
  sendVerificationEmail,
  sendPasswordResetOTPEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
  sendAccountActivationEmail
} = require('../utils/sendEmail');

// @desc    Get current user profile
// @route   GET /api/v1/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password -verificationCode -passwordResetOTP -passwordResetExpires');
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update current user profile
// @route   PUT /api/v1/users/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  // Restricted fields
  const restrictedFields = [
    'role', 'email', 'gpa', 'cgpa', 'coursesCompleted', 'currentCourses',
    'isVerified', 'verificationCode'
  ];
  restrictedFields.forEach(field => delete req.body[field]);

  const flatten = require('flat');
  const unflatten = require('flat').unflatten;

  const parsedBody = unflatten(req.body);

  if (!req.file && parsedBody.profilePhoto && typeof parsedBody.profilePhoto !== 'string') {
  delete parsedBody.profilePhoto;
}

  if (req.file) {
  if (req.user.profilePhoto && req.user.profilePhoto !== 'default.jpg') {
    multer.deleteFile(req.user.profilePhoto);
  }

  parsedBody.profilePhoto = req.file.filename;
}


  const updatedUser = await User.findByIdAndUpdate(
    req.user.id || req.user._id,
    parsedBody,
    { new: true, runValidators: false }
  ).select('-password -verificationCode -passwordResetOTP -passwordResetExpires');

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});


// @desc    Update user password
// @route   PUT /api/v1/users/me/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  // Send password changed email
  await sendPasswordChangedEmail(user);

  res.status(200).json({
    success: true,
    data: { id: user._id },
    message: 'Password updated successfully'
  });
});

// @desc    Update user settings
// @route   PUT /api/v1/users/me/settings
// @access  Private
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (req.body.notifications) {
    user.settings.notifications = { 
      ...user.settings.notifications, 
      ...req.body.notifications 
    };
  }

  if (req.body.preferences) {
    user.settings.preferences = { 
      ...user.settings.preferences, 
      ...req.body.preferences 
    };
  }

  if (req.body.privacy) {
    user.settings.privacy = { 
      ...user.settings.privacy, 
      ...req.body.privacy 
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.settings
  });
});

// @desc    Get all users (with optional role filtering)
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  // Create filter object
  const filter = {};
  
  // Add role filter if specified in query
  if (req.query.role) {
    filter.role = req.query.role;
  }

  // Add active filter if specified
  if (req.query.active) {
    filter.active = req.query.active === 'true';
  }

  // Build query
  const query = User.find(filter)
    .select('-password -verificationCode -passwordResetOTP -passwordResetExpires');

  // Execute query
  const users = await query;

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user (Admin only)
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password -verificationCode -passwordResetOTP -passwordResetExpires');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user (Admin only)
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  // Send welcome email
  await sendWelcomeEmail(user);

  // If email verification is required
  if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
    const verificationCode = user.createVerificationCode();
    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(user, verificationCode);
  }

  // Don't send back sensitive data
  user.password = undefined;
  user.verificationCode = undefined;
  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user (Admin only)
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Prevent changing certain fields
  if (req.body.password) {
    delete req.body.password;
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password -verificationCode -passwordResetOTP -passwordResetExpires');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Deactivate user (Admin only)
// @route   PUT /api/v1/users/:id/deactivate
// @access  Private/Admin
exports.deactivateUser = asyncHandler(async (req, res, next) => {
  if (req.params.id === req.user._id.toString()) {
    return next(new ErrorResponse('You cannot deactivate your own account', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  ).select('-password -verificationCode -passwordResetOTP -passwordResetExpires');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Reactivate user (Admin only)
// @route   PUT /api/v1/users/:id/reactivate
// @access  Private/Admin
exports.reactivateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: true },
    { new: true }
  ).select('-password -verificationCode -passwordResetOTP -passwordResetExpires');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Send account reactivation email
  await sendAccountActivationEmail(user);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Send verification email
// @route   POST /api/v1/users/me/send-verification
// @access  Private
exports.sendVerificationEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.isVerified) {
    return next(new ErrorResponse('Account is already verified', 400));
  }

  const verificationCode = user.createVerificationCode();
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user, verificationCode);

  res.status(200).json({
    success: true,
    message: 'Verification email sent'
  });
});

// @desc    Get system overview analytics
// @route   GET /api/v1/users/analytics/overview
// @access  Private/Admin
exports.getSystemOverview = asyncHandler(async (req, res, next) => {
  // Count total advisors
  const totalAdvisors = await User.countDocuments({ role: 'advisor' });
  
  // Count total students
  const totalStudents = await User.countDocuments({ role: 'student', active: true });
  
  // Count pending advising requests (assuming you have an Advising model)
  const pendingRequests = await Advising.countDocuments({ status: 'Pending' });

  res.status(200).json({
    success: true,
    data: {
      totalAdvisors,
      totalStudents,
      pendingRequests
    }
  });
});

exports.getAdvisorOverview = asyncHandler(async (req, res, next) => {
  const advisorId = req.user._id;
  
  // Basic counts
  const assignedStudents = await User.countDocuments({ 
    advisor: advisorId,
    role: 'student',
    active: true
  });
  
  const upcomingSessions = await Advising.countDocuments({
    advisor: advisorId,
    status: 'Scheduled',
    date: { $gte: new Date() }
  });
  
  const recentCompleted = await Advising.countDocuments({
    advisor: advisorId,
    status: 'Completed',
    date: { 
      $gte: new Date(new Date().setDate(new Date().getDate()-30)),
      $lte: new Date() 
    }
  });
  
  // More complex analytics
  const commonTopics = await Advising.aggregate([
    { $match: { advisor: advisorId } },
    { $group: { _id: "$topic", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      assignedStudents,
      upcomingSessions,
      recentCompleted,
      commonTopics
    }
  });
});