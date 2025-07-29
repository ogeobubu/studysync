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

// ======================
//  PROTECT ALL ROUTES
// ======================
router.use(protect);

// ======================
//  CURRENT USER ROUTES
// ======================
router.get("/me", authorize("student", "advisor", "admin"), getMe)
  router.put("/me", authorize("student", "advisor", "admin"), profileUpload, updateMe);

router.put("/me/password", authorize("student", "advisor", "admin"), updatePassword);

router.put("/me/settings", authorize("student", "advisor", "admin"), updateSettings);

// ======================
//  USER MANAGEMENT ROUTES
// ======================
router.get("/", authorize("advisor", "admin"), getUsers);

router.get("/:id", authorize("advisor", "admin"), getUser);

// ======================
//  ADMIN-ONLY ROUTES
// ======================
router.use(authorize("admin", "advisor"));

router.post("/", createUser);

router.put("/:id", profileUpload, updateUser)
  router.delete("/:id", deleteUser);

router.put("/:id/deactivate", deactivateUser);

router.put("/:id/reactivate", reactivateUser);

// ======================
//  ANALYTICS ROUTES
// ======================
router.get("/analytics/overview", getSystemOverview);

router.get("/analytics/advisor", authorize("advisor", "admin"), getAdvisorOverview);

module.exports = router;