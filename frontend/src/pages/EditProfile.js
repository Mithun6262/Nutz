// src/pages/EditProfile.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import axios from 'axios';
import { debounce } from 'lodash';

export default function EditProfile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const [username, setUsername] = useState(storedUser?.username || '');
  const [email] = useState(storedUser?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // ✅ Debounced function to check username availability
  const debouncedCheckUsername = debounce(async (username) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/check-username?username=${username}`);
      if (!res.data.available && username !== storedUser.username) {
        setUsernameError('Username already taken');
      } else {
        setUsernameError('');
      }
    } catch (err) {
      console.error('Username check error:', err);
    }
  }, 500);

  useEffect(() => {
    if (username.trim()) {
      debouncedCheckUsername(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleSaveChanges = async () => {
    setSaveMessage('');
    if (username.trim() === '') {
      setUsernameError('Username is required');
      return;
    }

    if (username !== storedUser.username && usernameError === '') {
      try {
        const response = await axios.put('http://localhost:5000/api/users/update-username', {
          userId: storedUser._id,
          newUsername: username,
        });

        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setSaveMessage('Username updated successfully');
          navigate('/profile');
        }
      } catch (error) {
        console.error('Failed to update username:', error);
        setUsernameError('Failed to update username');
      }
    } else if (username === storedUser.username) {
      navigate('/profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/change-password', {
        userId: storedUser._id,
        currentPassword: oldPassword,
        newPassword,
      });

      setPasswordMessage(res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            placeholder="Enter new username"
            onChange={(e) => setUsername(e.target.value)}
            style={usernameError ? { border: '1px solid red' } : {}}
          />
          {usernameError && <p className="error">{usernameError}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} disabled />
        </div>

        <button onClick={handleSaveChanges} className="save-button">Save Changes</button>
        {saveMessage && <p className="success">{saveMessage}</p>}
      </div>

      <div className="change-password-section">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Update Password</button>
        </form>
        {passwordMessage && <p className="message">{passwordMessage}</p>}
      </div>
        <div className="bottom-nav">
        <span onClick={() => navigate('/dashboard')}>🏠 Home</span>
        <span onClick={() => navigate('/my-posts')}>📂 My Posts</span>
        <span onClick={() => navigate('/profile')}>👤 Profile</span>
      </div>
    </div>
  );
}
