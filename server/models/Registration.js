// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Student' 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Course' 
  },
  session: { 
    type: String, 
    required: true 
  },
  semester: {
    type: String,
    enum: ['First', 'Second'],
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F']
  },
  gradePoint: {
    type: Number,
    min: 0,
    max: 5
  },
  dateRegistered: { 
    type: Date, 
    default: Date.now 
  }
});

// Add pre-save hook to automatically calculate grade and grade points
registrationSchema.pre('save', function(next) {
  if (this.score !== null && this.score !== undefined) {
    this.grade = calculateOAUGrade(this.score);
    this.gradePoint = calculateOAUGradePoint(this.grade);
  }
  next();
});

// OAU Grading System Functions
function calculateOAUGrade(score) {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  if (score >= 40) return 'E';
  return 'F';
}

function calculateOAUGradePoint(grade) {
  const gradePoints = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'E': 1,
    'F': 0
  };
  return gradePoints[grade] || 0;
}

module.exports = mongoose.model('Registration', registrationSchema);