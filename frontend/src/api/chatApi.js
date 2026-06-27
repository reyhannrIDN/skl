import api from './axios';

export const chatApi = {
  getGroups: () => api.get('/chat/groups'),
  createGroup: (data) => api.post('/chat/groups', data),
  getGroup: (id) => api.get(`/chat/groups/${id}`),
  getMessages: (id, page) => api.get(`/chat/groups/${id}/messages`, { params: { page } }),
  getPinnedMessages: (id) => api.get(`/chat/groups/${id}/pinned`),
  sendMessage: (id, data) => {
    if (data instanceof FormData) {
      return api.post(`/chat/groups/${id}/messages`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post(`/chat/groups/${id}/messages`, data);
  },
  markAsRead: (id) => api.post(`/chat/groups/${id}/read`),
  addMembers: (id, memberIds) => api.post(`/chat/groups/${id}/members`, { member_ids: memberIds }),
  getGroupMembers: (id) => api.get(`/chat/groups/${id}/members`),
  togglePinMessage: (id, messageId) => api.post(`/chat/groups/${id}/messages/${messageId}/pin`),
  deleteMessage: (id, messageId, type) => api.post(`/chat/groups/${id}/messages/${messageId}/delete`, { type }),
  uploadGroupPhoto: (id, formData) => api.post(`/chat/groups/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateGroup: (id, data) => api.put(`/chat/groups/${id}`, data),
  toggleAdmin: (id, userId) => api.post(`/chat/groups/${id}/admin/${userId}`),
  removeMember: (id, userId) => api.delete(`/chat/groups/${id}/members/${userId}`),
  getContacts: () => api.get('/chat/contacts'),
  getOnlineUsers: () => api.get('/chat/online-users'),
};
