// na here all api matter dey stay
const API_BASE = 'https://hexa-survey-backend.onrender.com/api';
const TOKEN_KEY = 'hexasurvey_token';
const EMAIL_KEY = 'hexasurvey_email';

// collect the saved login token
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// keep the new login token for browser
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// comot token when person don logout
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// pick the email we save before
function getEmail() {
  return localStorage.getItem(EMAIL_KEY) || '';
}

// save email make navbar fit show am
function setEmail(email) {
  localStorage.setItem(EMAIL_KEY, email);
}

// clear the saved email too
function clearEmail() {
  localStorage.removeItem(EMAIL_KEY);
}

// check if person still get login token
function isLoggedIn() {
  return !!getToken();
}

// send api request with token inside
async function apiFetch(path, options = {}) {
  const { redirectOnUnauthorized = true, ...fetchOptions } = options;
  const token = getToken();
  const headers = Object.assign({}, fetchOptions.headers || {});

  if (token) {
    // backend need this one to know who dey request
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
    // login don expire so carry person go signin page
    let responseBody = '';
    try {
      responseBody = await response.clone().text();
    } catch (error) {
      responseBody = 'Response body could not be read.';
    }
    console.error(`Unauthorized API request: ${path} (${response.status})`, responseBody);
    clearToken();
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `auth.html?redirect=${redirect}`;
    throw new Error('Unauthorized — redirecting to login.');
  }

  return response;
}

// clean local details and carry person go signin
function logout() {
  clearToken();
  clearEmail();
  window.location.href = 'auth.html';
}
