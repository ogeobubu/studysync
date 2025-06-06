const Course = require('../models/Course');
const User = require('../models/User');

const checkPrerequisites = async (studentId, courseCode) => {
  const student = await User.findById(studentId).populate('completedCourses');
  const course = await Course.findOne({ code: courseCode });
  
  if (!student || !course) {
    throw new Error('Student or course not found');
  }

  const missingPrerequisites = course.prerequisites.filter(prereq => 
    !student.completedCourses.some(c => c.code === prereq)
  );

  return {
    canTakeCourse: missingPrerequisites.length === 0,
    missingPrerequisites
  };
};

const generateRecommendations = async (studentId) => {
  const student = await User.findById(studentId).populate('completedCourses');
  const allCourses = await Course.find();
  
  const eligibleCourses = await Promise.all(
    allCourses.map(async course => {
      const { canTakeCourse } = await checkPrerequisites(studentId, course.code);
      return canTakeCourse ? course : null;
    })
  ).then(results => results.filter(Boolean));

  return eligibleCourses
    .filter(course => !student.completedCourses.some(c => c.code === course.code))
    .sort((a, b) => b.credits - a.credits)
    .slice(0, 5);
};

module.exports = {
  checkPrerequisites,
  generateRecommendations
};