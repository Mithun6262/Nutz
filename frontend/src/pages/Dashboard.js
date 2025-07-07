// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    }

    // ✅ Fetch all public posts
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts/public');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching public posts:', err);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome to Your Dashboard</h2>
        <div className="dashboard-buttons">
          <a href="/create-post"><button>Create Post</button></a>
          <a href="/my-posts"><button>My Posts</button></a>
          <a href="/change-password"><button>Change Password</button></a>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ✅ Public Posts Feed Section */}
      <div className="feed-section">
        <h3>📢 Public Posts from All Users</h3>
        {posts.length === 0 ? (
          <p>No public posts yet.</p>
        ) : (
          <div className="post-feed">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="post-user-info">
                    <div className="post-avatar"></div>
                    <p className="post-username">@{post.userId?.username}</p>
                  </div>
                  <p className="post-timestamp">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>

                {post.title && <p className="post-title">{post.title}</p>}
                <p className="post-content">{post.content}</p>

                <div className="post-actions">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>✈️</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
