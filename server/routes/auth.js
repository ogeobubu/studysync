const express = require('express');
const router = express.Router();
const {
  resendPasswordResetOTP,
  resetPassword,
  forgotPassword,
  resendVerificationEmail,
  verifyEmail,
  loginUser,
  registerUser
} = require('../controllers/authController');

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-password-otp', resendPasswordResetOTP);
router.post('/resend-verification', resendVerificationEmail);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;