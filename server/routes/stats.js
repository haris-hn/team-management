const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Member = require('../models/Member');
const auth = require('../middleware/auth');

// @route   GET /stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const [projectCount, memberCount, activeProjectCount] = await Promise.all([
      Project.countDocuments(),
      Member.countDocuments(),
      Project.countDocuments({ status: 'active' })
    ]);

    res.json({
      projects: projectCount,
      members: memberCount,
      active: activeProjectCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
