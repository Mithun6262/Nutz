const express = require('express');
const router = express.Router();
const { updateUsername } = require('../controllers/userController');

// ✅ PUT route to update username
router.put('/update-username', updateUsername);

module.exports = router;
