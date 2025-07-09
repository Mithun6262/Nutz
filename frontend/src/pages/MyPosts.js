// src/pages/MyPosts.js

import React, { useEffect, useState } from 'react';
import './MyPosts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/user/${user._id}`);
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching user posts:', err);
      }
    };

    fetchMyPosts();
  }, [user]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        data: { userId: user._id }
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      localStorage.setItem('refreshDashboard', 'true');
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="my-posts-container">
      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        <div className="my-post-feed">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <p className="post-title"><strong>{post.title}</strong></p>

              {post.imageUrl && (
                <img
                  src={`http://localhost:5000${post.imageUrl}`}
                  alt="Post"
                  className="post-image"
                />
              )}

              <p className="post-content">{post.content}</p>
              <p className="post-timestamp">
                {new Date(post.createdAt).toLocaleString()}
              </p>

              {/* Label + Delete aligned horizontally */}
              <div className="post-actions-row">
                <span className={post.visibility === 'private' ? 'private-label' : 'public-label'}>
                  {post.visibility === 'private' ? 'Private' : 'Public'}
                </span>

                <button className="delete-button" onClick={() => handleDelete(post._id)}>
                  🗑️ Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <span onClick={() => navigate('/dashboard')}>🏠 Home</span>
        <span onClick={() => navigate('/create-post')}>➕ Create</span>
        <span onClick={() => navigate('/profile')}>👤 Profile</span>
      </div>
    </div>
  );
}
