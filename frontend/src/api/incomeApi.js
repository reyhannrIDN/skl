import api from './axios';

const BASE = '/guru/income';

export const incomeApi = {
  getDashboard: (params) => api.get(`${BASE}/dashboard`, { params }),
  getStudents: (params) => api.get(`${BASE}/students`, { params }),
  getCharts: (params) => api.get(`${BASE}/charts`, { params }),
  createTransaction: (data) => api.post(`${BASE}/transactions`, data),
  getTransactions: (studentId) => api.get(`${BASE}/transactions/${studentId}`),
  updateTransaction: (id, data) => api.put(`${BASE}/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`${BASE}/transactions/${id}`),
  exportExcel: (params) => api.get(`${BASE}/export/excel`, { params, responseType: 'blob' }),
  exportPdf: (params) => api.get(`${BASE}/export/pdf`, { params, responseType: 'blob' }),
};

export const adminIncomeApi = {
  getDashboard: (params) => api.get('/admin/income/dashboard', { params }),
  getStudents: (params) => api.get('/admin/income/students', { params }),
  getCharts: (params) => api.get('/admin/income/charts', { params }),
  getTransactions: (studentId) => api.get(`/admin/income/transactions/${studentId}`),
  exportExcel: (params) => api.get('/admin/income/export/excel', { params, responseType: 'blob' }),
  exportPdf: (params) => api.get('/admin/income/export/pdf', { params, responseType: 'blob' }),
};
