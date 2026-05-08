import api from './api';

// Mock order data for fallback/testing
const mockOrderAssignments = {};

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
  async getAllOrders() {
    const response = await api.get('/orders/all');
    return response.data.data;
  },

  async weighOrder(id, request) {
    try {
      const response = await api.put(`/orders/${id}/weigh`, request);
      return response.data.data;
    } catch (error) {
      // Mock fallback for weight recording
      console.warn('Using mock weight recording:', error);
      return { id, actualWeight: request.actualWeight };
    }
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
    try {
      const response = await api.put(`/orders/${id}/machines`, request);
      return response.data.data;
    } catch (error) {
      // Mock fallback for machine assignment
      console.warn('Using mock machine assignment. Backend error:', error.message);
      mockOrderAssignments[id] = request;
      return { id, machineId: request.machineId, processType: request.processType };
    }
  },

  async getAvailableMachines(type) {
    const response = await api.get(`/machines/available?type=${encodeURIComponent(type)}`);
    return response.data;
  },
};
