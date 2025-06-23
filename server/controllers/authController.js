const jwt = require('jsonwebtoken');
const User = require("../models/User");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const {
  sendVerificationEmail,
  sendPasswordResetOTPEmail,
  sendWelcomeEmail
} = require('../utils/sendEmail');

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Email already in use', 400));
  }

  const user = new User({ name, email, password, role });
  const verificationCode = user.createVerificationCode();
  await user.save();

  await sendWelcomeEmail(user);
  await sendVerificationEmail(user, verificationCode);

  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
  });
});

// @desc    Verify Email
// @route   POST /api/v1/auth/verify
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;
  const user = await User.findOne({ verificationCode: otp });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired verification code', 400));
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully!'
  });
});

// @desc    Resend Verification Email
// @route   POST /api/v1/auth/resend-verification
// @access  Public
exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (user.isVerified) {
    return next(new ErrorResponse('Email is already verified', 400));
  }

  const verificationCode = user.createVerificationCode();
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user, verificationCode);

  res.status(200).json({
    success: true,
    message: 'Verification email sent successfully!'
  });
});

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const otp = user.createPasswordResetOTP();
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetOTPEmail(user.name, user.email, otp);

  res.status(200).json({
    success: true,
    message: 'Password reset OTP sent to your email!'
  });
});

// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (user.passwordResetOTP !== otp || Date.now() > user.passwordResetExpires) {
    return next(new ErrorResponse('Invalid or expired OTP', 400));
  }

  user.password = newPassword;
  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully!'
  });
});

// @desc    Resend Password Reset OTP
// @route   POST /api/v1/auth/resend-password-otp
// @access  Public
exports.resendPasswordResetOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const otp = user.createPasswordResetOTP();
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetOTPEmail(user.name, user.email, otp);

  res.status(200).json({
    success: true,
    message: 'New OTP for password reset sent to your email!'
  });
});
