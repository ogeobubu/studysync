const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByPartAndSemester
} = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourse);

// Protected routes for admin users
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

// Route to fetch courses by part and semester
router.get('/filter', getCoursesByPartAndSemester);

module.exports = router;