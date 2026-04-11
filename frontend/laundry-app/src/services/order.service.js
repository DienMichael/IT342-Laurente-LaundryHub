import api from './api';

export const orderService = {
  // Customer endpoints
  async createBooking(request) {
    const response = await api.post('/orders/bookings', request);
    return response.data.data;
  },

  async getMyOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data.data;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  // Staff/Admin endpoints
  async weighOrder(id, request) {
    const response = await api.put(`/orders/${id}/weigh`, request);
    return response.data.data;
  },

  async confirmPayment(id) {
    const response = await api.put(`/orders/${id}/pay`, {});
    return response.data.data;
  },

  async updateStatus(id, request) {
    const response = await api.put(`/orders/${id}/status`, request);
    return response.data.data;
  },

  async assignMachine(id, request) {
    const response = await api.put(`/orders/${id}/machines`, request);
    return response.data.data;
  },
};