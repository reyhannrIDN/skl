import api from './axios';

const downloadBackup = (filename) => api.get(`/admin/backups/${filename}/download`, {
  responseType: 'blob',
});

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

  // Backup Management
  getBackups: () => api.get('/admin/backups'),
  createBackup: () => api.post('/admin/backups', {}, { skipErrorRedirect: true }),
  downloadBackup,
  restoreBackup: (filename, data) => api.post(`/admin/backups/${filename}/restore`, data, { skipErrorRedirect: true }),
  restoreBackupFromUpload: (formData) => api.post('/admin/backups/restore-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    skipErrorRedirect: true,
  }),
  deleteBackup: (filename) => api.delete(`/admin/backups/${filename}`),
  getBackupSchedule: () => api.get('/admin/backups/schedule'),
  updateBackupSchedule: (data) => api.put('/admin/backups/schedule', data),

  // Permissions
  getPermissions: (params) => api.get('/admin/permissions', { params }),
  updateUserPermissions: (id, data) => api.put(`/admin/permissions/${id}`, data),
};
