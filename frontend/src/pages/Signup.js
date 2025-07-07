import React, { useState, useEffect } from 'react';
import './Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // ✅ Real-time check for username availability
  const checkUsernameAvailability = debounce(async (value) => {
    if (!value.trim()) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/check-username?username=${value}`);
      if (!res.data.available) {
        setUsernameError('Username already exists');
      } else {
        setUsernameError('');
      }
    } catch (err) {
      console.error(err);
    }
  }, 500);

  // ✅ Real-time check for email availability
  const checkEmailAvailability = debounce(async (value) => {
    if (!value.trim()) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/check-email?email=${value}`);
      if (!res.data.available) {
        setEmailError('Email already registered');
      } else {
        setEmailError('');
      }
    } catch (err) {
      console.error(err);
    }
  }, 500);

  useEffect(() => {
    if (username.trim()) {
      checkUsernameAvailability(username);
    }
  }, [username, checkUsernameAvailability]);

  useEffect(() => {
    if (email.trim()) {
      checkEmailAvailability(email);
    }
  }, [email, checkEmailAvailability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    }

    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    return;
    } else if (password.length > 12) {
      setPasswordError('Password must not exceed 12 characters');
    return;
    }else {
    setPasswordError('');
    }


    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        navigate('/login');
      }

    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'Username already taken'
      ) {
        setUsernameError('Username already exists');
      } else if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'Email already registered'
      ) {
        setEmailError('Email already registered');
      } else {
        alert('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Signup</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          style={usernameError ? { border: '1px solid red' } : {}}
        />
        {usernameError && <p className="error">{usernameError}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          style={emailError ? { border: '1px solid red' } : {}}
        />
        {emailError && <p className="error">{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError('');
          }}
          style={passwordError ? { border: '1px solid red' } : {}}
        />
        {passwordError && <p className="error">{passwordError}</p>}

        <button type="submit">Signup</button>
        <p className="switch-auth">
        Already have an account?{' '}
        <span onClick={() => navigate('/login')}>Log in</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
