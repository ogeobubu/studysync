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
    getSystemOverview
} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { profileUpload } = require("../utils/multer");

// Routes for current user
router.use(protect); // All routes below require authentication

// Student-specific routes
router.get("/me", authorize("student", "advisor", "admin"), getMe);
router.put(
  "/me",
  authorize("student", "advisor", "admin"),
  profileUpload,
  updateMe
);
router.put(
  "/me/password",
  authorize("student", "advisor", "admin"),
  updatePassword
);
router.put(
  "/me/settings",
  authorize("student", "advisor", "admin"),
  updateSettings
);
router.get("/", getUsers);
router.get("/:id", getUser);

// Admin-only routes
router.use(authorize("admin"));
router.post("/", createUser);
router.put("/:id", profileUpload, updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/deactivate", deactivateUser);
router.put("/:id/reactivate", reactivateUser);
router.get('/analytics/overview', protect, authorize('admin'), getSystemOverview
);

module.exports = router;
