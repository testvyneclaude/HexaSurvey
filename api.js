// Shared API helper — JWT auth instead of cookies (needed for the Vercel/Render split origin).
// Assumes login/signup responses look like: { success: true, data: { access_token: "...", ...user } }
// Update API_BASE below to your real Render URL.

const API_BASE = 'https://hexa-survey-backend.onrender.com/api';
const TOKEN_KEY = 'hexasurvey_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function isLoggedIn() {
  return !!getToken();
}

// Wrapper around fetch that attaches the JWT and auto-redirects on 401.
// Usage: apiFetch('/surveys', { method: 'POST', body: JSON.stringify({...}) })
async function apiFetch(path, options = {}) {
  const { redirectOnUnauthorized = true, ...fetchOptions } = options;
  const token = getToken();
  const headers = Object.assign({}, fetchOptions.headers || {});

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (fetchOptions.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers
  });

  if (response.status === 401 && redirectOnUnauthorized) {
    clearToken();
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `auth.html?redirect=${redirect}`;
    throw new Error('Unauthorized — redirecting to login.');
  }

  return response;
}

function logout() {
  clearToken();
  window.location.href = 'auth.html';
}
