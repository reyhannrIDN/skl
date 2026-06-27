import api from './axios';

const BASE = '/lomba';

export const lombaApi = {
  getDashboard: (params) => api.get(`${BASE}/dashboard`, { params }),
  getList: (params) => api.get(BASE, { params }),
  getDetail: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(BASE, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.post(`${BASE}/${id}`, { ...data, _method: 'PUT' }, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`${BASE}/${id}`),
  deleteFoto: (id) => api.delete(`${BASE}/foto/${id}`),
  uploadFoto: (id, data) => api.post(`${BASE}/${id}/foto`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  exportExcel: (params) => api.get(`${BASE}/export/excel`, { params, responseType: 'blob' }),
  exportPdf: (params) => api.get(`${BASE}/export/pdf`, { params, responseType: 'blob' }),
  getReferensi: () => api.get(`${BASE}/referensi/siswa-guru`),
};
