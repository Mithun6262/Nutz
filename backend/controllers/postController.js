// controllers/postController.js

const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');

// ✅ Create Post (with optional image)
const createPost = async (req, res) => {
  try {
    const { title, content, visibility, userId } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newPost = new Post({
      title,
      content,
      visibility,
      userId,
      imageUrl,
    });

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
    const posts = await Post.find({ visibility: 'public' })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch public posts' });
  }
};

// ✅ Toggle Like/Unlike a Post
const toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({
      liked: !alreadyLiked,
      totalLikes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// ✅ Add Comment to Post
const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const comment = { userId, username: user.username, text };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// ✅ Delete Post with Owner Check
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

module.exports = {
  createPost,
  getUserPosts,
  getAllPublicPosts,
  toggleLike,
  addComment,
  deletePost
};
