import api from './axios';

export const statsApi = {
  getAccessibleClasses: () => api.get('/stats/performance/classes'),
  getCategories: () => api.get('/stats/performance/categories'),
  getPerformanceData: (classId, categoryId) => api.get(`/stats/performance/data/${classId}/${categoryId}`),
  getClassMonitoring: (classId) => api.get(`/stats/performance/class-monitoring/${classId}`),
};
