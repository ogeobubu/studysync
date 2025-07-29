const express = require("express");
const router = express.Router();
const {
  getMe,
  updateMe,
  updatePassword,
  updateSettings,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
  getSystemOverview,
  getAdvisorOverview
} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { profileUpload } = require("../utils/multer");


router.get("/me", protect, authorize("student", "advisor", "admin"), getMe)
  router.put("/me", protect, authorize("student", "advisor", "admin"), profileUpload, updateMe);

router.put("/me/password", protect, authorize("student", "advisor", "admin"), updatePassword);

router.put("/me/settings", protect, authorize("student", "advisor", "admin"), updateSettings);

// ======================
//  USER MANAGEMENT ROUTES
// ======================
router.get("/", protect, authorize("advisor", "admin"), getUsers);

router.get("/:id", protect, authorize("advisor", "admin"), getUser);

router.post("/", protect, authorize("admin", "advisor"), createUser);

router.put("/:id", protect, profileUpload, updateUser)

router.delete("/:id", protect, authorize("admin", "advisor"), deleteUser);

router.put("/:id/deactivate", protect, deactivateUser);

router.put("/:id/reactivate", protect, reactivateUser);

// ======================
//  ANALYTICS ROUTES
// ======================
router.get("/analytics/overview", protect, getSystemOverview);

router.get("/analytics/advisor", protect, authorize("advisor", "admin"), getAdvisorOverview);

module.exports = router;