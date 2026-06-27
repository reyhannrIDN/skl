import axios from 'axios';
import { API_BASE_URL } from '@/utils/runtimeConfig';

export let inMemoryToken = localStorage.getItem('token') || null;
export const setToken = (token) => { 
  inMemoryToken = token; 
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};
export const getToken = () => inMemoryToken;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  withXSRFToken: false,
});

api.interceptors.request.use(
  (config) => {
    const token = inMemoryToken || localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const skipRedirect = originalRequest?.skipErrorRedirect;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject});
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        setToken(data.access_token);
        processQueue(null, data.access_token);
        originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        setToken(null);
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Only redirect to error page for critical non-auth errors
    if (!skipRedirect && [404, 500, 503].includes(status)) {
      window.location.href = `/error/${status}`;
    }

    return Promise.reject(error);
  }
);

export default api;
