// services/advisingService.js
const Course = require('../models/Course');
const User = require('../models/User');

// Functional programming approach to advising
const getRecommendedCourses = async (studentId) => {
  const student = await User.findById(studentId).populate('completedCourses');
  if (!student) throw new Error('Student not found');
  
  const { level, program } = student;
  const allCourses = await Course.find({ level, program });
  
  // Filter completed courses
  const completedCourseCodes = student.completedCourses.map(c => c.code);
  
  // Get available courses (not completed and prerequisites met)
  const availableCourses = await Promise.all(
    allCourses.map(async course => {
      if (completedCourseCodes.includes(course.code)) return null;
      
      const prerequisitesMet = await checkPrerequisites(studentId, course.code);
      return prerequisitesMet ? course : null;
    })
  ).then(results => results.filter(Boolean));
  
  // Sort by core courses first, then electives
  return availableCourses.sort((a, b) => {
    if (a.isElective && !b.isElective) return 1;
    if (!a.isElective && b.isElective) return -1;
    return a.code.localeCompare(b.code);
  });
};

const checkPrerequisites = async (studentId, courseCode) => {
  const student = await User.findById(studentId).populate('completedCourses');
  const course = await Course.findOne({ code: courseCode });
  
  if (!student || !course) {
    throw new Error('Student or course not found');
  }
  
  const completedCourseCodes = student.completedCourses.map(c => c.code);
  const missingPrerequisites = course.prerequisites.filter(
    prereq => !completedCourseCodes.includes(prereq)
  );
  
  return {
    canTakeCourse: missingPrerequisites.length === 0,
    missingPrerequisites
  };
};

// Special OAU CSE function to check SIWES eligibility
const checkSIWESEligibility = async (studentId) => {
  const student = await User.findById(studentId).populate('completedCourses');
  if (!student) throw new Error('Student not found');
  
  // OAU specific rules for SIWES (CSC 400/CPE 400)
  const requiredCourses = ['CPE 203', 'CPE 204', 'CPE 206', 'CSC 201', 'CSC 202'];
  const completedCourseCodes = student.completedCourses.map(c => c.code);
  
  const missingCourses = requiredCourses.filter(
    course => !completedCourseCodes.includes(course)
  );
  
  return {
    eligible: missingCourses.length === 0,
    missingCourses,
    message: missingCourses.length > 0 
      ? `Need to complete: ${missingCourses.join(', ')}`
      : 'Eligible for SIWES'
  };
};

module.exports = {
  getRecommendedCourses,
  checkPrerequisites,
  checkSIWESEligibility
};