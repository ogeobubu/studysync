// middlewares/authMiddleware.js - DEBUG VERSION
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes - verify JWT
exports.protect = async (req, res, next) => {
  console.log('\n🔐 === AUTH MIDDLEWARE DEBUG ===');
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Method: ${req.method}`);
  
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found in Authorization header');
  } else {
    console.log('No Authorization header found');
  }

  console.log(`Token: ${token ? 'Present' : 'Missing'}`);

  // Make sure token exists
  if (!token) {
    console.log('❌ No token provided - returning 401');
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    console.log('Verifying token...');
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    // Get user from token
    req.user = await User.findById(decoded.id);
    console.log(`User found: ${req.user ? req.user.email : 'Not found'}`);

    if (!req.user) {
      console.log('❌ User not found - returning 404');
      return next(new ErrorResponse('No user found with this ID', 404));
    }

    console.log('✅ Authentication successful');
    console.log('===============================\n');
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    console.log('===============================\n');
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('\n🔒 === AUTHORIZATION DEBUG ===');
    console.log(`Required roles: ${roles}`);
    console.log(`User role: ${req.user?.role}`);
    
    if (!roles.includes(req.user.role)) {
      console.log('❌ Authorization failed');
      console.log('==============================\n');
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    
    console.log('✅ Authorization successful');
    console.log('==============================\n');
    next();
  };
};