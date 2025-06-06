const Course = require('../models/Course');

const isValidCourseCode = (code) => {
  return /^[A-Z]{2,3} \d{3}$/.test(code);
};

const createCourse = async (courseData) => {
  if (!isValidCourseCode(courseData.code)) {
    throw new Error('Invalid course code format (e.g., CSC 101)');
  }

  const existingCourse = await Course.findOne({ code: courseData.code });
  if (existingCourse) {
    throw new Error('Course with this code already exists');
  }

  return Course.create(courseData);
};

const getCoursesByLevelAndProgram = async (level, program) => {
  return Course.find({ level, program }).sort({ code: 1 });
};

const getPrerequisiteTree = async (courseCode) => {
  const visited = new Set();
  
  const buildTree = async (code) => {
    if (visited.has(code)) return null;
    visited.add(code);
    
    const course = await Course.findOne({ code });
    if (!course) return null;
    
    const prerequisites = await Promise.all(
      course.prerequisites.map(buildTree)
    );
    
    return {
      code: course.code,
      title: course.title,
      prerequisites: prerequisites.filter(Boolean)
    };
  };
  
  return buildTree(courseCode);
};

module.exports = {
  createCourse,
  getCoursesByLevelAndProgram,
  getPrerequisiteTree,
  isValidCourseCode
};