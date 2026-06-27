import api from './axios';

export const idnApi = {
  getDashboard: () => api.get('/idn/dashboard'),

  getStudents: () => api.get('/idn/students'),
  createStudent: (data) => api.post('/idn/students', data),
  updateStudent: (id, data) => api.put(`/idn/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/idn/students/${id}`),

  getSchoolVisits: () => api.get('/idn/school-visits'),
  createSchoolVisit: (data) => api.post('/idn/school-visits', data),
  updateSchoolVisit: (id, data) => api.put(`/idn/school-visits/${id}`, data),
  deleteSchoolVisit: (id) => api.delete(`/idn/school-visits/${id}`),
};
