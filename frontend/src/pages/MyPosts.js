// src/pages/MyPosts.js

import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // reuse same CSS used for Dashboard
import axios from 'axios';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/user/${user._id}`);
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch user posts:', err);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>📝 My Posts</h2>
      </div>

      <div className="feed-section">
        {posts.length === 0 ? (
          <p>You have not created any posts yet.</p>
        ) : (
          <div className="post-feed">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="post-user-info">
                    <div className="post-avatar"></div>
                    <p className="post-username">@You</p>
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

                <span className={post.isPrivate ? 'private-label' : 'public-label'}>
                  {post.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
