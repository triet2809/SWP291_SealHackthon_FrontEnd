import { API_BASE_URL } from '../config/registerConfig';
import { apiGet } from './client';

async function postJson(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { ok: res.ok, status: res.status, data };
}

export function registerFpt({ fullName, email, password, studentId, campusId }) {
  return postJson('/auth/register', {
    fullName,
    email,
    password,
    studentId,
    campusId: campusId || null,
    studentType: 'fpt',
  });
}

export function registerExternal({ fullName, email, password, universityName }) {
  return postJson('/auth/register', {
    fullName,
    email,
    password,
    universityName,
    studentType: 'external',
  });
}

export function login({ email, password }) {
  return postJson('/auth/login', { email, password });
}

export async function logout() {
  // Full backend currently has no /auth/logout endpoint. Logout is local token clear.
  clearStoredAuth();
  return { ok: true, status: 204, data: null };
}

export function clearStoredAuth() {
  localStorage.removeItem('seal_access_token');
  localStorage.removeItem('seal_refresh_token');
  localStorage.removeItem('seal_token_type');
  localStorage.removeItem('seal_user');
}

export async function me() {
  const result = await apiGet('/auth/me');
  return { ...result, value: result.data ?? null };
}
