import React, { useState } from 'react';
import { machineService } from '../../services/machine.service';
import { toast } from 'sonner';

const MachineManagement = () => {
  const [selectedType, setSelectedType] = useState('WASHING');
  const machines = machineService.getAllMachines(selectedType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold">Machine Management</h1>
          </div>

          {/* Machine Type Filter */}
          <div className="px-6 py-4 border-b flex gap-4">
            <button
              onClick={() => setSelectedType('WASHING')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedType === 'WASHING'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Washing Machines
            </button>
            <button
              onClick={() => setSelectedType('DRYING')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedType === 'DRYING'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dryers
            </button>
          </div>

          {/* Machines Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {machines.map((machine) => (
                <div
                  key={machine.id}
                  className={`p-4 rounded-lg border-2 transition ${
                    machine.available
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{machine.name}</h3>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        machine.available ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <p className="font-medium">ID: {machine.id}</p>
                  </div>

                  <div className="text-sm">
                    {machine.available ? (
                      <span className="text-green-700 font-semibold">✓ Available</span>
                    ) : (
                      <div>
                        <span className="text-red-700 font-semibold block">✗ Unavailable</span>
                        <span className="text-red-600 text-xs">
                          In use by Order {machine.usedByOrder}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 pt-6 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-700 font-semibold">
                    Available: {machines.filter(m => m.available).length}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-700 font-semibold">
                    In Use: {machines.filter(m => !m.available).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineManagement;
