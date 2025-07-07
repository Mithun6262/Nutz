const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authController = require('../controllers/authController');

// ✅ Signup route
router.post('/signup', authController.signup);

// ✅ Login route
router.post('/login', authController.login);

// ✅ Change Password route
router.post('/change-password', authController.changePassword);

// ✅ Real-time Username Availability Check
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ available: false });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ available: false }); // Username taken
    } else {
      return res.json({ available: true }); // Username available
    }
  } catch (err) {
    return res.status(500).json({ available: false });
  }
});

// ✅ Real-time Email Availability Check
router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ available: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ available: false }); // Email taken
    } else {
      return res.json({ available: true }); // Email available
    }
  } catch (err) {
    return res.status(500).json({ available: false });
  }
});

module.exports = router;
