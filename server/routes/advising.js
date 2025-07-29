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

// Student routes
router.post("/", createAdvisingRequest)
router.get("/", getAllAdvisingRequests);

router.get("/my", getStudentAdvisingRequests);
router.get("/pending", getPendingRequests);
router.get("/advisor/my-pending", getAdvisorPendingRequests);


router.get("/:id",getRequestById)
router.delete("/:id", deleteAdvisingRequest);

router.patch("/assign/:id", assignAdvisor);
router.patch("/status/:id", updateRequestStatus);

module.exports = router;