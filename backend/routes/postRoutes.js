// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const {
  createPost,
  getUserPosts,
  getAllPublicPosts,
  toggleLike,
  addComment,
  deletePost
} = require('../controllers/postController');

router.post('/create', upload.single('image'), createPost);
router.get('/user/:userId', getUserPosts);
router.get('/public', getAllPublicPosts);
router.post('/:postId/like', toggleLike);
router.post('/:postId/comment', addComment);
router.delete('/:postId', deletePost);

module.exports = router;
