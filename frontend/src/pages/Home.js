// src/pages/Home.js

import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Create a New Post 📝
          Your Thoughts, Safely Stored</h1>
        <p>Securely create and manage your private & public posts</p>
        <div className="home-buttons">
          <a href="/signup"><button>Sign Up</button></a>
          <a href="/login"><button>Log In</button></a>
        </div>
      </div>
    </div>
  );
}
