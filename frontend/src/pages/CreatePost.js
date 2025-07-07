// src/pages/CreatePost.js

import React, { useState } from 'react';
import './CreatePost.css';

export default function CreatePost() {
  const [post, setPost] = useState({ title: '', content: '', isPrivate: false });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleCheckbox = () => {
    setPost({ ...post, isPrivate: !post.isPrivate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    const res = await fetch('http://localhost:5000/api/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, userId: user._id }),
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      setPost({ title: '', content: '', isPrivate: false });
    }
  };

  return (
    <div className="create-post-container">
      <form className="create-post-form" onSubmit={handleSubmit}>
        <h2>Create a New Post</h2>
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={post.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Write your message here..."
          value={post.content}
          onChange={handleChange}
          required
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={post.isPrivate}
            onChange={handleCheckbox}
          />
          Make this post private
        </label>
        <button type="submit">Post</button>
        {message && <p className="post-message">{message}</p>}
      </form>
    </div>
  );
}
