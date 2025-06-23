const express = require("express");
const router = express.Router();
const {
  createAdvisingRequest,
  getAllAdvisingRequests,
  getStudentAdvisingRequests,
  assignAdvisor,
  deleteAdvisingRequest,
  getPendingRequests,
  getRequestById
} = require("../controllers/advisingController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Create advising request
router.post("/", protect, authorize("student"), createAdvisingRequest);

// Get advising requests for the logged-in student
router.get("/my", protect, authorize("student"), getStudentAdvisingRequests);

// Get all advising requests (for admin and advisors)
router.get("/", protect, authorize("advisor", "admin"), getAllAdvisingRequests);

// Get pending requests (for dashboard)
router.get("/pending", protect, authorize("admin", "advisor"), getPendingRequests);

// Get single request by ID
router.get("/:id", protect, getRequestById);

// Assign advisor to an advising request
router.patch("/:id/assign", protect, authorize("admin", "advisor"), assignAdvisor);

// Delete an advising request
router.delete('/:id', protect, authorize('admin'), deleteAdvisingRequest);

module.exports = router;