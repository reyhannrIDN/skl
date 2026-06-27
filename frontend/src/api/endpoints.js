import api from './axios';

export const authApi = {
  getCsrfCookie: () => api.get('../sanctum/csrf-cookie'),
  login: (credentials) => api.post('/auth/login', credentials, { skipErrorRedirect: true }),
  register: (data) => api.post('/auth/register', data, { skipErrorRedirect: true }),
  googleLogin: (data) => api.post('/auth/google', data, { skipErrorRedirect: true }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  systemInfo: () => api.get('/system-info'),
  getLockSettings: () => api.get('/auth/lock-settings'),
  updateLockSettings: (data) => api.put('/auth/lock-settings', data),
  verifyLock: (data) => api.post('/auth/verify-lock', data),
};
