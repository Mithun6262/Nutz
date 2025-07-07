// src/api.js

const BACKEND_URL = 'http://localhost:5000/api/auth';

export async function signup(userData) {
  const res = await fetch(`${BACKEND_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function login(userData) {
  const res = await fetch(`${BACKEND_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}
