import api from './axios';

export const schedulingApi = {
  getPublicSlots: async (slug, date) => {
    const response = await api.get(`/scheduling/public/${slug}/slots`, {
      params: { date }
    });
    return response.data;
  },

  bookSession: async (data) => {
    const response = await api.post('/scheduling/book', data);
    return response.data;
  },

  getMySchedule: async (startDate, endDate) => {
    const response = await api.get('/scheduling/me', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getMySession: async (sessionId) => {
    const response = await api.get(`/scheduling/me/${sessionId}`);
    return response.data;
  },

  updateMySession: async (sessionId, data) => {
    const response = await api.patch(`/scheduling/me/${sessionId}`, data);
    return response.data;
  },

  cancelMySession: async (sessionId, reason) => {
    const response = await api.patch(`/scheduling/me/${sessionId}/cancel`, { reason });
    return response.data;
  },
};
