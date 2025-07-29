const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByPartAndSemester,
  getCoursesByProgram
} = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// IMPORTANT: Put specific routes BEFORE parameterized routes
// Filter routes - these must come first
router.get('/filter', getCoursesByPartAndSemester);
router.get('/programs/:program', getCoursesByProgram);

// General routes
router.get('/', getAllCourses);

// Protected routes for admin users
router.post('/', protect, authorize('admin'), createCourse);

// Parameterized routes - these should come LAST
router.get('/:id', getCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;