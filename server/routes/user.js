const express = require('express');
const router = express.Router();
const {
  getMe,
  updateMe,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Routes for current user
router.get("/me", protect, authorize("student"), getMe);
router.put('/me', protect, authorize("student"), updateMe);

// Admin-only routes
router.use(authorize('admin'));
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;