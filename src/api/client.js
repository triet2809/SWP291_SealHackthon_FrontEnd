import { API_BASE_URL } from '../config/registerConfig';

function getAccessToken() {
  return localStorage.getItem('seal_access_token');
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401) {
    localStorage.removeItem('seal_access_token');
    localStorage.removeItem('seal_refresh_token');
    localStorage.removeItem('seal_token_type');
    localStorage.removeItem('seal_user');
  }

  return { ok: res.ok, status: res.status, data };
}

export function apiGet(path) {
  return request(path);
}

export function apiPost(path, body) {
  return request(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch(path, body) {
  return request(path, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPut(path, body) {
  return request(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete(path) {
  return request(path, { method: 'DELETE' });
}

export async function apiDownload(path) {
  const headers = {};
  const accessToken = getAccessToken();
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(`${API_BASE_URL}${path}`, { headers });
  const text = await res.text();
  if (res.status === 401) {
    localStorage.removeItem('seal_access_token');
    localStorage.removeItem('seal_refresh_token');
    localStorage.removeItem('seal_token_type');
    localStorage.removeItem('seal_user');
  }
  return { ok: res.ok, status: res.status, text, headers: res.headers };
}
