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
const { profileUpload } = require("../utils/multer");


router.get("/me", getMe)
  router.put("/me", profileUpload, updateMe);

router.put("/me/password", updatePassword);

router.put("/me/settings", updateSettings);

// ======================
//  USER MANAGEMENT ROUTES
// ======================
router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/", createUser);

router.put("/:id", updateUser)

router.delete("/:id", deleteUser);

router.put("/:id/deactivate", deactivateUser);

router.put("/:id/reactivate", reactivateUser);

// ======================
//  ANALYTICS ROUTES
// ======================
router.get("/analytics/overview", getSystemOverview);

router.get("/analytics/advisor", getAdvisorOverview);

module.exports = router;