import api from './api';
import { mockMachines } from '../data/mockMachines';

export const machineService = {
  async getAllMachines() {
    try {
      const response = await api.get(`/machines`);
      return response.data;
    } catch (error) {
      console.warn('Using mock machines data:', error);
      return this.getMockAllMachines();
    }
  },

  async getMachinesByType(type) {
    try {
      const response = await api.get(`/machines/type/${encodeURIComponent(type)}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock machines data for type:', type, error);
      return mockMachines[type] || [];
    }
  },

  async getAvailableMachines(type) {
    try {
      const response = await api.get(`/machines/available?type=${encodeURIComponent(type)}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock machines data:', error);
      return this.getMockAvailableMachines(type);
    }
  },

  async getMachineById(id) {
    try {
      const response = await api.get(`/machines/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch machine:', error);
      return null;
    }
  },

  getMockAllMachines() {
    const allMachines = [];
    for (const type in mockMachines) {
      allMachines.push(...mockMachines[type]);
    }
    return allMachines;
  },

  getMockAvailableMachines(type) {
    const machines = mockMachines[type] || [];
    return machines.filter(machine => machine.available);
  },

  getAllMachinesSync() {
    return this.getMockAllMachines();
  },
};
