import api from './axios';

export const siswaApi = {
  // Submissions
  getCategories: () => api.get('/submissions/categories'),
  getMySubmissions: () => api.get('/submissions/my'),
  getSubmission: (slug) => api.get(`/submissions/${slug}`),
  createSubmission: (data) => api.post('/submissions', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateSubmission: (slug, data) => api.post(`/submissions/${slug}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteSubmission: (slug) => api.delete(`/submissions/${slug}`),
  
  // Specific file operations if needed separately
  uploadFile: (slug, fileData, onUploadProgress) => api.post(`/submissions/${slug}/files`, fileData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  }),
  deleteFile: (slug, fileId) => api.delete(`/submissions/${slug}/files/${fileId}`),
};
