// controllers/postController.js

const Post = require('../models/Post');

// ✅ Create Post
const createPost = async (req, res) => {
  try {
    const { title, content, visibility, userId } = req.body;

    const newPost = new Post({ title, content, visibility, userId });
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// ✅ Get Posts by Specific User
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user posts' });
  }
};

// ✅ Get All Public Posts for Dashboard Feed
const getAllPublicPosts = async (req, res) => {
  try {
    const posts = await Post.find({ visibility: 'public' }) // ✅ fixed here
      .sort({ createdAt: -1 }) // newest first
      .populate('userId', 'username'); // populate username from User model

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch public posts' });
  }
};

module.exports = {
  createPost,
  getUserPosts,
  getAllPublicPosts, // ✅ export public posts route
};
