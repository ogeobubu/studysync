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

// Student routes
router.post("/", protect, authorize("student"), createAdvisingRequest)
router.get("/", protect, authorize("advisor", "admin"), getAllAdvisingRequests);

router.get("/my", protect, authorize("student"), getStudentAdvisingRequests);
router.get("/pending", protect, authorize("admin", "advisor"), getPendingRequests);
router.get("/advisor/my-pending", protect, authorize("advisor"), getAdvisorPendingRequests);


router.get("/:id", protect, getRequestById)
router.delete("/:id", protect, authorize("admin", "student"), deleteAdvisingRequest);

router.patch("/:id/assign", protect, authorize("admin", "advisor"), assignAdvisor);
router.patch("/:id/status", protect, authorize("admin", "advisor"), updateRequestStatus);

module.exports = router;