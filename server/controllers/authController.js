const jwt = require('jsonwebtoken');
const User = require("../models/User")
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetOTPEmail } = require('../services/email');

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new Error('User not found'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new Error('Invalid credentials'));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(token)

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
  } catch (err) {
    next(err);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({ name, email, password, role });
    const verificationCode = user.createVerificationCode();
    await user.save();

    await sendVerificationEmail(name, email, verificationCode);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ verificationCode: otp });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!'
    });
  } catch (err) {
    next(err);
  }
};

exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const verificationCode = user.createVerificationCode()
    await user.save();

    await sendVerificationEmail(user.name, user.email, verificationCode)

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully!'
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP for password reset
    const otp = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false }); // Skip validation for the password field

    // Send email with OTP
    await sendPasswordResetOTPEmail(user.name, user.email, otp);

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email!',
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP is valid and not expired
    if (user.passwordResetOTP !== otp || Date.now() > user.passwordResetExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update the user's password
    user.password = newPassword; // Ensure to hash the password in the User model's pre-save hook
    user.passwordResetOTP = undefined; // Clear the OTP
    user.passwordResetExpires = undefined; // Clear the expiration
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully!',
    });
  } catch (err) {
    next(err);
  }
};

exports.resendPasswordResetOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false });

    // Send email with new OTP
    await sendPasswordResetOTPEmail(user.name, user.email, otp);

    res.status(200).json({
      success: true,
      message: 'New OTP for password reset sent to your email!',
    });
  } catch (err) {
    next(err);
  }
};