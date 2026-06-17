import { create } from 'zustand';
import { authApi } from '../api/endpoints';
import { setToken, getToken } from '../api/axios';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null, 
  isLoading: false,
  error: null,
  hasChecked: false,
  
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setToken(token); // Sync with axios
    set({ user, token, error: null });
  },
  
  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setToken(null); // Clear axios token
      set({ user: null, token: null });
      window.location.href = '/login';
    }
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.getMe();
      const user = res.data.user || res.data;
      const latestToken = localStorage.getItem('token');
      set({ user, token: latestToken, error: null, hasChecked: true });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      set({ user: null, token: null, hasChecked: true });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Listen for force logout from axios
window.addEventListener('auth:logout', () => {
  localStorage.removeItem('user');
  useAuthStore.setState({ user: null, token: null });
});
