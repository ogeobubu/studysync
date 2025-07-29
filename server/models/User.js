const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      maxlength: [100, "Email cannot be more than 100 characters"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["student", "advisor", "admin"],
      default: "student",
    },
    matricNumber: {
      type: String,
      uppercase: true,
      sparse: true,
      validate: {
        validator: function (value) {
          if (!value) return true; // Allow null/undefined
          return /^[A-Z]{2,3}\/[A-Z]{2,4}\/\d{2}\/\d{3,5}$/.test(value);
        },
        message:
          "Please provide a valid matric number format (e.g., CS/ENG/20/1234)",
      },
    },
    program: {
      type: String,
      enum: [
        "Computer Science",
        "Computer Science with Mathematics",
        "Computer Science with Economics",
        "Computer Engineering",
        null,
      ],
      default: null,
    },
    specialization: {
      type: String,
      enum: [
        "Computer Science",
        "Computer Science with Mathematics",
        "Computer Science with Economics",
        "Computer Engineering",
        null,
      ],
      default: null,
    },
    level: {
      type: String,
      enum: {
        values: ["Part I", "Part II", "Part III", "Part IV", "Part V", null],
        message: 'Level must be "Part I" to "Part V" for OAU students',
      },
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true; // Allow null
          // Ensure it follows OAU's part system
          return /^Part [I-V]$/.test(value);
        },
        message: 'Invalid OAU level format. Use "Part I" through "Part V"',
      },
      set: function (value) {
        // Standardize input (case-insensitive, trim whitespace)
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (/^part\s[i-v]$/i.test(trimmed)) {
            return (
              trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
            );
          }
        }
        return value;
      },
    },
    coursesCompleted: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],
    currentCourses: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],
    gpa: {
      type: Number,
      min: [0, "GPA cannot be less than 0"],
      max: [5, "GPA cannot be more than 5"],
    },
    cgpa: {
      type: Number,
      min: [0, "CGPA cannot be less than 0"],
      max: [5, "CGPA cannot be more than 5"],
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (value) {
          if (!value) return true; // Allow null/undefined
          return validator.isMobilePhone(value, "any", { strictMode: false });
        },
        message: "Please provide a valid phone number",
      },
    },
    address: {
      type: String,
      maxlength: [200, "Address cannot be more than 200 characters"],
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true; // Allow null/undefined
          return value < new Date();
        },
        message: "Date of birth must be in the past",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say", null],
      default: null,
    },
    profilePhoto: {
      type: String,
      default: "default.jpg",
    },
    // Settings
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      preferences: {
        language: { type: String, enum: ["en", "fr", "es"], default: "en" },
        theme: {
          type: String,
          enum: ["light", "dark", "system"],
          default: "light",
        },
      },
      privacy: {
        shareData: { type: Boolean, default: true },
        profileVisible: { type: Boolean, default: false },
      },
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
    verificationExpires: Date,
    passwordResetOTP: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (keep only these explicit indexes, remove 'unique: true' from field definitions above)
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ matricNumber: 1 }, { unique: true, sparse: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to create password reset token
UserSchema.methods.createPasswordResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetOTP = crypto.createHash("sha256").update(otp).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// Method to generate a 6-digit verification code
UserSchema.methods.createVerificationCode = function () {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  this.verificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationCode;
};

// Check if account is locked
UserSchema.methods.isAccountLocked = function () {
  return this.accountLockedUntil && this.accountLockedUntil > Date.now();
};

// Increment login attempts
UserSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.accountLockedUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
  }
};

// Reset login attempts after successful login
UserSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.accountLockedUntil = undefined;
};

module.exports = mongoose.model("User", UserSchema);