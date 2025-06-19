const Course = require('../models/Course');
const Registration = require('../models/Registration');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get recommended courses
// @route   GET /api/v1/recommendations
// @access  Private
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  
  // 1. Get student's completed courses
  const completedCourses = await Registration.find({
    studentId,
    grade: { $ne: null }
  }).populate('courseId');

  // 2. Get student's program
  const program = req.user.program;
  if (!program) {
    return next(new ErrorResponse('Student program not found', 400));
  }

  // 3. Get all available courses in the program
  const availableCourses = await Course.find({ 
    programs: program,
    isElective: true
  });

  // 4. Filter out already taken courses
  const takenCourseIds = completedCourses.map(c => c.courseId._id);
  const potentialCourses = availableCourses.filter(
    course => !takenCourseIds.includes(course._id)
  );

  // 5. Simple recommendation algorithm (can be enhanced)
  const recommendedCourses = potentialCourses
    .sort((a, b) => {
      // Sort by prerequisites match (courses with more matched prerequisites first)
      const aPrereqMatch = a.prerequisites.filter(p => 
        takenCourseIds.includes(p)).length;
      const bPrereqMatch = b.prerequisites.filter(p => 
        takenCourseIds.includes(p)).length;
      
      return bPrereqMatch - aPrereqMatch;
    })
    .slice(0, 5); // Return top 5 recommendations

  res.status(200).json({
    success: true,
    count: recommendedCourses.length,
    data: recommendedCourses
  });
});