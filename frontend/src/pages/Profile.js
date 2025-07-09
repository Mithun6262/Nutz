// src/pages/Profile.js

import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const [postStats, setPostStats] = useState({ public: 0, private: 0 });
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/user/${user._id}`);
        const publicPosts = res.data.filter((post) => post.visibility === 'public').length;
        const privatePosts = res.data.filter((post) => post.visibility === 'private').length;
        setPostStats({ public: publicPosts, private: privatePosts });
      } catch (err) {
        console.error('Error fetching post counts:', err);
      }
    };

    if (user) fetchCounts();
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <p className="username">🔵 {user?.username}</p>
        <p className="email">✉️ {user?.email}</p>

        <div className="stats-row">
          <div className="stat-box">
            <span>Public Posts</span>
            <p>{postStats.public}</p>
          </div>
          <div className="stat-box">
            <span>Private Posts</span>
            <p>{postStats.private}</p>
          </div>
        </div>

        <button className="quote-button" onClick={() => navigate('/create-post')}>
          💬 Share a Quote
        </button>

        <div className="action-buttons">
          <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
          <button onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}>Logout</button>
        </div>
      </div>

      <div className="bottom-nav">
        <span onClick={() => navigate('/dashboard')}>🏠 Home</span>
        <span onClick={() => navigate('/create-post')}>➕ CreatePost</span>
        <span onClick={() => navigate('/my-posts')}>📂 My Post</span>
      </div>
    </div>
  );
}
