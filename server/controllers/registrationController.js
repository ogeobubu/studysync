const Registration = require("../models/Registration");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc    Register for a course
// @route   POST /api/v1/registrations
// @access  Private
exports.registerCourse = asyncHandler(async (req, res, next) => {
  const { studentId, courseId, session, semester } = req.body;

  // Check if already registered for this course in this session
  const existingRegistration = await Registration.findOne({
    studentId,
    courseId,
    session,
    semester,
  });

  if (existingRegistration) {
    return next(
      new ErrorResponse(
        "Already registered for this course in this session",
        400
      )
    );
  }

  const registration = await Registration.create({
    studentId,
    courseId,
    session,
    semester,
  });

  res.status(201).json({
    success: true,
    data: registration,
  });
});

// @desc    Update course grade
// @route   PUT /api/v1/registrations/:id/grade
// @access  Private/Admin
exports.updateGrade = asyncHandler(async (req, res, next) => {
  const { score, semester, session } = req.body;

  if (score === undefined || score === null || isNaN(score)) {
    return next(new ErrorResponse('Please provide a valid score', 400));
  }

  const registration = await Registration.findById(req.params.id).populate('courseId');

  if (!registration) {
    return next(new ErrorResponse(`Registration not found with id of ${req.params.id}`, 404));
  }

  registration.score = score;

  await registration.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: registration
  });
});


// @desc    Get registrations for a student with grades
// @route   GET /api/v1/registrations/student/:studentId
// @access  Private
exports.getStudentRegistrations = asyncHandler(async (req, res, next) => {
  const { id: studentId } = req.params
  const registrations = await Registration.find({
    studentId,
  })
    .populate("courseId")
    .sort({ session: -1, semester: -1 });

  // Calculate CGPA
  const gradedCourses = registrations.filter((reg) => reg.gradePoint !== null);
  const totalPoints = gradedCourses.reduce(
    (sum, reg) => sum + reg.gradePoint * reg.courseId.credits,
    0
  );
  const totalCredits = gradedCourses.reduce(
    (sum, reg) => sum + reg.courseId.credits,
    0
  );
  const cgpa =
    totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;

  res.status(200).json({
    success: true,
    count: registrations.length,
    cgpa,
    data: registrations,
  });
});
