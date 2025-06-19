const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  title: { type: String, required: true },
  level: { type: String, enum: ['Part I', 'Part II', 'Part III', 'Part IV', 'Part V'], required: true },
  programs: { 
    type: [String], 
    enum: ['Computer Science', 'Computer Science with Mathematics', 'Computer Science with Economics', 'Computer Engineering'],
    required: true 
  },
  credits: { type: Number, required: true, min: 1, max: 6 },
  prerequisites: [{ type: String }],
  isElective: { type: Boolean, default: false },
  description: String,
  semester: { type: String, enum: ['First', 'Second'], required: true }
});

module.exports = mongoose.model('Course', courseSchema);