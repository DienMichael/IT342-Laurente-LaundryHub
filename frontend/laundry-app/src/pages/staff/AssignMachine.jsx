import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { orderService } from '../../services/order.service';
import { machineService } from '../../services/machine.service';

const AssignMachine = () => {
  const { id } = useParams();
  const [processType, setProcessType] = useState('');
  const [machineId, setMachineId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const [availableMachines, setAvailableMachines] = useState([]);

  useEffect(() => {
    // When staff selects a process type, load AVAILABLE machines from backend
    const loadAvailableMachines = async () => {
      if (!processType) {
        setAvailableMachines([]);
        return;
      }

      try {
        const machines = await machineService.getAvailableMachines(processType);
        setAvailableMachines(machines || []);
        if (machines && machines.length === 0) {
          toast.info('No available machines of this type');
        }
      } catch (error) {
        console.error('Failed to load available machines:', error);
        setAvailableMachines([]);
        toast.error('Failed to load available machines');
      }
    };

    loadAvailableMachines();
  }, [processType]);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const orderId = parseInt(id);
    if (Number.isNaN(orderId)) {
      toast.error('Invalid order id. Redirecting...');
      setTimeout(() => navigate('/staff'), 2000);
      return;
    }

    try {
      const data = await orderService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Order not found. Redirecting...');
      setTimeout(() => navigate('/staff'), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!processType || !machineId) {
      toast.error('Please select process type and machine');
      return;
    }

    setLoading(true);
    try {
      await orderService.assignMachine(parseInt(id), {
        processType: processType.toUpperCase(),
        machineId: parseInt(machineId),
      });

      toast.success(`Order assigned to ${processType} successfully!`);

      if (processType.toUpperCase() === 'WASHING') {
        toast.info('After washing is complete, assign a dryer');
      } else {
        toast.success('Order processing complete!');
      }

      navigate('/staff');
    } catch (error) {
      toast.error('Failed to assign machine');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Assign Machine - Order #{id}</h1>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Current Status:</p>
            <p className="text-lg font-semibold text-blue-600">{order.status}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Process Type
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={processType}
                onChange={(e) => {
                  setProcessType(e.target.value);
                  setMachineId('');
                }}
              >
                <option value="">Select process type</option>
                <option value="WASHING">Washing</option>
                <option value="DRYING">Drying</option>
              </select>
            </div>

            {processType && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Machine
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                >
                  <option value="">Select a machine</option>
                  {availableMachines.length === 0 ? (
                    <option value="" disabled>
                      No available machines
                    </option>
                  ) : (
                    availableMachines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.type} #{machine.id} ({machine.capacity}kg) - {machine.status}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Make sure to mark the process as complete in the machine
                after finishing to update the order status automatically.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/staff')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Assigning...' : 'Assign Machine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignMachine;