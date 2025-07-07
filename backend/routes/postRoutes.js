const express = require('express');
const router = express.Router();

const {
  createPost,
  getUserPosts,
  getAllPublicPosts, // ✅ New controller
} = require('../controllers/postController');

// Route to create a new post
router.post('/create', createPost);

// Route to get posts of a specific user
router.get('/user/:userId', getUserPosts);

// ✅ New: Route to get all public posts (Dashboard feed)
router.get('/public', getAllPublicPosts);

module.exports = router;
