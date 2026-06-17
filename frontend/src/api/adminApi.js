import api from './axios';

export const adminApi = {
  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  resetPassword: (id, data) => api.post(`/admin/users/${id}/reset-password`, data),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  toggleRegistration: (isOpen) => api.put('/admin/settings/registration', { is_open: isOpen }),
  uploadLogo: (data) => api.post('/admin/settings/logo', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Reports
  getStatistics: () => api.get('/admin/statistics'),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
  exportSubmissions: (params) => api.get('/admin/export/submissions', { 
    params, 
    responseType: 'blob' // Important for file download
  }),

  // Class Management
  getClasses: () => api.get('/admin/classes'),
  createClass: (data) => api.post('/admin/classes', data),
  updateClass: (id, data) => api.put(`/admin/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/admin/classes/${id}`),
  getEligibleTeachers: () => api.get('/admin/eligible-teachers'),
};
