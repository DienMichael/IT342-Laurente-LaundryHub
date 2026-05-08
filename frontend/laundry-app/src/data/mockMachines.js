// Mock machine data with availability status
// In production, this would come from the backend API

export const mockMachines = {
  WASHING: [
    { id: 'W001', name: 'Washer 1', type: 'WASHING', available: true, usedByOrder: null },
    { id: 'W002', name: 'Washer 2', type: 'WASHING', available: true, usedByOrder: null },
    { id: 'W003', name: 'Washer 3', type: 'WASHING', available: false, usedByOrder: 'ORD-1001' },
    { id: 'W004', name: 'Washer 4', type: 'WASHING', available: true, usedByOrder: null },
    { id: 'W005', name: 'Washer 5', type: 'WASHING', available: false, usedByOrder: 'ORD-1002' },
    { id: 'W006', name: 'Washer 6', type: 'WASHING', available: true, usedByOrder: null },
    { id: 'W007', name: 'Washer 7', type: 'WASHING', available: false, usedByOrder: 'ORD-1003' },
    { id: 'W008', name: 'Washer 8', type: 'WASHING', available: true, usedByOrder: null },
    { id: 'W009', name: 'Washer 9', type: 'WASHING', available: true, usedByOrder: null },
    { id: 'W010', name: 'Washer 10', type: 'WASHING', available: false, usedByOrder: 'ORD-1004' },
  ],
  DRYING: [
    { id: 'D001', name: 'Dryer 1', type: 'DRYING', available: true, usedByOrder: null },
    { id: 'D002', name: 'Dryer 2', type: 'DRYING', available: false, usedByOrder: 'ORD-1005' },
    { id: 'D003', name: 'Dryer 3', type: 'DRYING', available: true, usedByOrder: null },
    { id: 'D004', name: 'Dryer 4', type: 'DRYING', available: true, usedByOrder: null },
    { id: 'D005', name: 'Dryer 5', type: 'DRYING', available: false, usedByOrder: 'ORD-1006' },
    { id: 'D006', name: 'Dryer 6', type: 'DRYING', available: true, usedByOrder: null },
    { id: 'D007', name: 'Dryer 7', type: 'DRYING', available: false, usedByOrder: 'ORD-1007' },
    { id: 'D008', name: 'Dryer 8', type: 'DRYING', available: true, usedByOrder: null },
    { id: 'D009', name: 'Dryer 9', type: 'DRYING', available: true, usedByOrder: null },
    { id: 'D010', name: 'Dryer 10', type: 'DRYING', available: false, usedByOrder: 'ORD-1008' },
  ],
};
