const express = require("express");
const router = express.Router();
const {
  createAdvisingRequest,
  getAllAdvisingRequests,
  getStudentAdvisingRequests,
} = require("../controllers/advisingController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/request", protect, authorize("student"), createAdvisingRequest);
router.get("/my", protect, authorize("student"), getStudentAdvisingRequests);

router.get("/", protect, authorize("advisor"), getAllAdvisingRequests);

module.exports = router;
