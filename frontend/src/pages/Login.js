import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        navigate('/dashboard'); // Or wherever you want to redirect after login
      }
    } catch (err) {
      console.error(err);
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === 'Invalid credentials'
      ) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          style={error && !email ? { border: '1px solid red' } : {}}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          style={error && !password ? { border: '1px solid red' } : {}}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>

        <p className="switch-auth">
          Don&apos;t have an account?{' '}
          <span onClick={() => navigate('/signup')}>Create one</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
