import api from './axios';

export const availabilityApi = {
  getMyAvailability: async () => {
    const response = await api.get('/availability/me');
    return response.data;
  },

  updateMyAvailability: async (data) => {
    const response = await api.put('/availability/me', data);
    return response.data;
  },

  getPublicAvailability: async (slug) => {
    const response = await api.get(`/availability/public/${slug}`);
    return response.data;
  },
};
