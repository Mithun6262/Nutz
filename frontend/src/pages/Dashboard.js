import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts/public');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching public posts:', err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    }
    fetchPosts();
  }, [navigate]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {
        userId: user._id,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: res.data.liked
                  ? [...(post.likes || []), user._id]
                  : post.likes.filter((id) => id !== user._id),
              }
            : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        userId: user._id,
        text: commentTexts[postId],
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), res.data.comment] }
            : post
        )
      );
      setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        data: { userId: user._id },
      });

      fetchPosts(); // ✅ Auto-refresh dashboard
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome to Your Dashboard</h2>
        <div className="dashboard-buttons">
          <a href="/create-post"><button>Create Post</button></a>
          <a href="/my-posts"><button>My Posts</button></a>
          <a href="/profile"><button>Profile</button></a> {/* ✅ Only Profile now */}
        </div>
      </div>

      <div className="feed-section">
        <h3>📢 Posts from Other Users</h3>
        {posts.length === 0 ? (
          <p>No public posts yet.</p>
        ) : (
          <div className="post-feed">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <p className="post-username">@{post.userId?.username}</p>
                {post.title && <p className="post-title"><strong>{post.title}</strong></p>}
                <p className="post-content">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={`http://localhost:5000${post.imageUrl}`}
                    alt="Post"
                    className="post-image"
                  />
                )}

                <p className="post-timestamp">
                  {new Date(post.createdAt).toLocaleString()}
                </p>

                <div className="like-section">
                  <button
                    className={`like-button ${post.likes?.includes(user._id) ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    ❤️ Like
                  </button>
                  <span className="like-count">{post.likes?.length || 0} Likes</span>
                </div>

                <div className="comment-section">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentTexts[post._id] || ''}
                    onChange={(e) =>
                      setCommentTexts((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                  />
                  <button onClick={() => handleCommentSubmit(post._id)}>Comment</button>
                </div>

                {post.comments?.map((comment, idx) => (
                  <div key={idx} className="comment">
                    <strong>@{comment.username}:</strong> {comment.text}
                  </div>
                ))}

                {post.userId?._id === user._id && (
                  <button className="delete-button" onClick={() => handleDelete(post._id)}>
                    🗑️ Delete Post
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
