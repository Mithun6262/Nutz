import React, { useState } from 'react';
import './CreatePost.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !user) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('visibility', visibility);
    formData.append('userId', user._id);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:5000/api/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (visibility === 'public') {
        navigate('/dashboard');
      } else {
        navigate('/my-posts');
      }

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="public">🌍 Public</option>
          <option value="private">🔒 Private</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">📤 Post</button>
      </form>

      {/* ✅ Bottom Navigation Bar */}
      <div className="bottom-nav">
        <span onClick={() => navigate('/dashboard')}>🏠 Home</span>
        <span onClick={() => navigate('/my-posts')}>📂 My Posts</span>
        <span onClick={() => navigate('/profile')}>👤 Profile</span>
      </div>
    </div>
  );
}
