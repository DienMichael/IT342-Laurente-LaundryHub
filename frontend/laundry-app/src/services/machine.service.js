import api from './api';
import { mockMachines } from '../data/mockMachines';

export const machineService = {
  async getAvailableMachines(type) {
    try {
      const response = await api.get(`/machines/available?type=${encodeURIComponent(type)}`);
      // backend returns raw list of machines (no ApiResponse wrapper)
      return response.data;
    } catch (error) {
      // Fallback to mock data for development/demo
      console.warn('Using mock machines data:', error);
      return this.getMockAvailableMachines(type);
    }
  },

  getMockAvailableMachines(type) {
    const machines = mockMachines[type] || [];
    return machines.filter(machine => machine.available);
  },

  getAllMachines(type) {
    return mockMachines[type] || [];
  },

  getMachineById(id) {
    for (const type in mockMachines) {
      const machine = mockMachines[type].find(m => m.id === id);
      if (machine) return machine;
    }
    return null;
  },
};

