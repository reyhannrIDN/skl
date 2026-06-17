import api from './axios';

export const guruApi = {
  getSubmissions: (params) => api.get('/guru/submissions', { params }),
  getSubmissionDetail: (slug) => api.get(`/guru/submissions/${slug}`),
  submitReview: (slug, data) => api.post(`/guru/submissions/${slug}/review`, data),
  updateChecklistItem: (slug, itemId, data) => api.put(`/guru/submissions/${slug}/checklist/${itemId}`, data),
  issueSkl: (slug, data) => api.post(`/guru/submissions/${slug}/issue-skl`, data),
  requestRevision: (slug, data) => api.post(`/guru/submissions/${slug}/request-revision`, data),
  getStatistics: () => api.get('/guru/statistics'),

  // Category Management
  getCategories: () => api.get('/guru/categories'),
  createCategory: (data) => api.post('/guru/categories', data),
  updateCategory: (id, data) => api.put(`/guru/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/guru/categories/${id}`),
  updateRequirements: (id, data) => api.post(`/guru/categories/${id}/requirements`, data),

  // Student Group Management
  getGroups: () => api.get('/guru/groups'),
  getGroupDetail: (id) => api.get(`/guru/groups/${id}`),
  createGroup: (data) => api.post('/guru/groups', data),
  updateGroup: (id, data) => api.put(`/guru/groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/guru/groups/${id}`),
  getAvailableStudents: () => api.get('/guru/students/available'),
  addGroupStudents: (id, studentIds) => api.post(`/guru/groups/${id}/students`, { student_ids: studentIds }),
  removeGroupStudent: (id, studentId) => api.delete(`/guru/groups/${id}/students/${studentId}`),
  updateStudent: (id, data) => api.put(`/guru/students/${id}`, data),
  getMyClass: () => api.get('/guru/my-class'),

  // Task Management (Wali Kelas)
  getTasks: () => api.get('/guru/tasks'),
  createTask: (data) => api.post('/guru/tasks', data),
  updateTask: (id, data) => api.put(`/guru/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/guru/tasks/${id}`),
};
