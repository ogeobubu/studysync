// services/progressService.js
const Course = require('../models/Course');
const User = require('../models/User');

// Functional approach to progress tracking
const calculateProgress = async (studentId) => {
  const student = await User.findById(studentId).populate('completedCourses');
  if (!student) throw new Error('Student not found');
  
  const { level, program } = student;
  const allRequiredCourses = await Course.find({ 
    level: { $lte: level },
    program,
    isElective: false 
  });
  
  const completedCourses = student.completedCourses;
  const completedRequired = completedCourses.filter(c => !c.isElective);
  
  // Calculate progress by level
  const progressByLevel = {};
  const levels = ['Part I', 'Part II', 'Part III', 'Part IV', 'Part V'];
  
  for (const lvl of levels) {
    if (levels.indexOf(lvl) > levels.indexOf(level)) break;
    
    const levelCourses = allRequiredCourses.filter(c => c.level === lvl);
    const completed = completedCourses.filter(c => c.level === lvl);
    
    progressByLevel[lvl] = {
      total: levelCourses.length,
      completed: completed.length,
      percentage: Math.round((completed.length / levelCourses.length) * 100)
    };
  }
  
  // Overall progress
  const totalRequired = allRequiredCourses.length;
  const totalCompleted = completedRequired.length;
  const overallPercentage = Math.round((totalCompleted / totalRequired) * 100);
  
  return {
    program,
    currentLevel: level,
    overallProgress: {
      totalRequired,
      totalCompleted,
      percentage: overallPercentage
    },
    levelProgress: progressByLevel,
    // OAU-specific: Check final year project eligibility
    isFinalYearProjectEligible: level === 'Part V' && 
      overallPercentage >= 70 && 
      completedCourses.some(c => c.code === 'CSC 503') // Research methodology
  };
};

module.exports = {
  calculateProgress
};