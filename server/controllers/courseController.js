const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    Get a single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Validate programs array
  if (!req.body.programs || !Array.isArray(req.body.programs)) {
    return next(new ErrorResponse('Programs must be an array.', 400));
  }

  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = asyncHandler(async (req, res, next) => {
  // Validate programs array
  if (req.body.programs && !Array.isArray(req.body.programs)) {
    return next(new ErrorResponse('Programs must be an array.', 400));
  }

  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get courses by part and semester
// @route   GET /api/courses/filter?part=PartI&semester=First
// @access  Public
exports.getCoursesByPartAndSemester = asyncHandler(async (req, res, next) => {
  const { part, semester, program } = req.query;

  const query = {};
  if (part) query.level = part;
  if (semester) query.semester = semester;
  if (program) query.programs = { $in: [program] };

  const courses = await Course.find(query);
  
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    Get courses by program
// @route   GET /api/courses/programs/:program
// @access  Public
exports.getCoursesByProgram = asyncHandler(async (req, res, next) => {
  const { program } = req.params;

  const courses = await Course.find({ 
    programs: { $in: [program] } 
  });

  if (!courses.length) {
    return next(new ErrorResponse(`No courses found for program: ${program}`, 404));
  }

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});