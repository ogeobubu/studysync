const express = require('express');
const router = express.Router();
const { checkPrerequisites, generateRecommendations } = require('../services/advisingService');
const authenticate = require('../middlewares/authenticate');

const handlePrerequisiteCheck = async (req, res) => {
  try {
    const result = await checkPrerequisites(req.user.id, req.params.courseCode);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const handleRecommendations = async (req, res) => {
  try {
    const recommendations = await generateRecommendations(req.user.id);
    res.json(recommendations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

router.get('/prerequisites/:courseCode', authenticate, handlePrerequisiteCheck);
router.get('/recommendations', authenticate, handleRecommendations);

module.exports = router;