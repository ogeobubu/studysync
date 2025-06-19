const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["student", "advisor", "admin"],
    default: "student",
  },
  matricNumber: {
    type: String,
    unique: true,
    uppercase: true,
    sparse: true // Allows null values while maintaining unique index
  },
  program: {
    type: String,
    enum: ["Computer Science", "Computer Science with Mathematics", "Computer Science with Economics", "Computer Engineering", null],
    default: null
  },
  level: {
    type: String,
    enum: ["Part I", "Part II", "Part III", "Part IV", "Part V", null],
    default: null
  },
  coursesCompleted: [{
    type: String,
    uppercase: true
  }],
  currentCourses: [{
    type: String,
    uppercase: true
  }],
  gpa: {
    type: Number,
    min: 0,
    max: 5
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 5
  },
  phoneNumber: String,
  address: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ["male", "female", null],
    default: null
  },
  // Verification fields
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    select: false,
  },
  passwordResetOTP: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to create password reset token
UserSchema.methods.createPasswordResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  this.passwordResetOTP = otp; // Store the OTP
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  return otp;
};

// Method to generate a 6-digit verification code
UserSchema.methods.createVerificationCode = function () {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
  this.verificationCode = verificationCode; // Store the code
  return verificationCode;
};

module.exports = mongoose.model("User", UserSchema);