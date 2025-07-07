// src/pages/ChangePassword.js

import React, { useState } from 'react';
import './ChangePassword.css';

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    const res = await fetch('http://localhost:5000/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId: user._id }),
    });

    const data = await res.json();
    setMessage(data.message);
    setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleSubmit}>
        <h2>Change Password</h2>
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Password</button>
        {message && <p className="change-message">{message}</p>}
      </form>
    </div>
  );
}
