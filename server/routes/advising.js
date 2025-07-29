const express = require("express");
const router = express.Router();
const {
  createAdvisingRequest,
  getAllAdvisingRequests,
  getStudentAdvisingRequests,
  assignAdvisor,
  deleteAdvisingRequest,
  getPendingRequests,
  getRequestById,
  getAdvisorPendingRequests,
  updateRequestStatus
} = require("../controllers/advisingController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ======================
//  STUDENT ROUTES
// ======================
router.post("/", protect, authorize("student"), createAdvisingRequest);
router.get("/my", protect, authorize("student"), getStudentAdvisingRequests);

// ======================
//  REQUEST MANAGEMENT
// ======================
router.get("/", protect, authorize("advisor", "admin"), getAllAdvisingRequests);
router.get("/pending", protect, authorize("admin", "advisor"), getPendingRequests);
router.get("/:id", protect, getRequestById);

// ======================
//  ADVISOR-SPECIFIC ROUTES
// ======================
router.get("/advisor/my-pending", protect, authorize("advisor"), getAdvisorPendingRequests);

// ======================
//  REQUEST ACTIONS
// ======================
router.patch("/:id/assign", protect, authorize("admin", "advisor"), assignAdvisor);
router.patch("/:id/status", protect, authorize("admin", "advisor"), updateRequestStatus);
router.delete("/:id", protect, authorize("admin", "student"), deleteAdvisingRequest);

module.exports = router;