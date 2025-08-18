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
router.route("/me")
  .get(authorize("student", "advisor", "admin"), getMe)
  .put(authorize("student", "advisor", "admin"), profileUpload, updateMe);

router.route("/me/password")
  .put(authorize("student", "advisor", "admin"), updatePassword);

router.route("/me/settings")
  .put(authorize("student", "advisor", "admin"), updateSettings);

// ======================
//  USER MANAGEMENT ROUTES
// ======================
router.route("/")
  .get(authorize("advisor", "admin", "student"), getUsers);

router.route("/:id")
  .get(authorize("advisor", "admin"), getUser);

// ======================
//  ADMIN-ONLY ROUTES
// ======================
router.use(authorize("admin", "advisor"));

router.route("/")
  .post(createUser);

router.route("/:id")
  .put(profileUpload, updateUser)
  .delete(deleteUser);

router.route("/:id/deactivate")
  .put(deactivateUser);

router.route("/:id/reactivate")
  .put(reactivateUser);

// ======================
//  ANALYTICS ROUTES
// ======================
router.route('/analytics/overview')
  .get(getSystemOverview);

router.route('/analytics/advisor')
  .get(authorize("advisor", "admin"), getAdvisorOverview);

module.exports = router;