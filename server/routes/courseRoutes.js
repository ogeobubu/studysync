const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByPartAndSemester,
  getCoursesByProgram
} = require("../controllers/courseController");

// Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourse);

// Protected routes for admin users
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

// Route to fetch courses by part and semester
router.get("/filter", getCoursesByPartAndSemester);
router.get("/programs/:id", getCoursesByProgram);

module.exports = router;