import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { orderService } from '../../services/order.service';
import { machineService } from '../../services/machine.service';
import StatusBadge from '../../components/common/StatusBadge';
import { format } from 'date-fns';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [weighingOrderId, setWeighingOrderId] = useState(null);
  const [weighingWeight, setWeighingWeight] = useState('');
  const [submittingWeight, setSubmittingWeight] = useState(false);
  const [selectingMachineType, setSelectingMachineType] = useState(null);
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [assigningMachineType, setAssigningMachineType] = useState(null);
  const [availableMachines, setAvailableMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'ALL'
    ? orders
    : orders.filter(order => order.status === filter);

  const statusOptions = [
    'ALL', 'BOOKED', 'AWAITING_WEIGHING', 'AWAITING_PAYMENT',
    'PAID', 'WASHING', 'DRYING', 'READY_FOR_PICKUP', 'COMPLETED'
  ];

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleWeighOrder = (orderId) => {
    setWeighingOrderId(orderId);
    setWeighingWeight('');
  };

  const handleSubmitWeight = async () => {
    if (!weighingWeight || parseFloat(weighingWeight) <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    setSubmittingWeight(true);
    try {
      await orderService.weighOrder(weighingOrderId, { actualWeight: parseFloat(weighingWeight) });
      toast.success('Weight recorded successfully!');
      setWeighingOrderId(null);
      setWeighingWeight('');
      fetchOrders();
    } catch (error) {
      console.error('Failed to weigh order:', error);
      toast.error('Failed to record weight');
    } finally {
      setSubmittingWeight(false);
    }
  };

  const handleSelectMachineType = (machineType) => {
    setSelectingMachineType(machineType);
    setAssigningMachineType(machineType);
    const machines = machineService.getAllMachines(machineType);
    setAvailableMachines(machines);
    setSelectedMachine(null);
  };

  const handleSubmitAssignment = async () => {
    if (!selectedMachine) {
      toast.error('Please select a machine');
      return;
    }

    if (!selectedMachine.available) {
      toast.error('This machine is not available');
      return;
    }

    setSubmittingAssignment(true);
    try {
      await orderService.assignMachine(assigningOrderId, {
        processType: assigningMachineType,
        machineId: selectedMachine.id,
      });
      toast.success(`Machine ${selectedMachine.name} assigned successfully!`);
      setAssigningOrderId(null);
      setAssigningMachineType(null);
      setAvailableMachines([]);
      setSelectedMachine(null);
      setSelectingMachineType(null);
      fetchOrders();
    } catch (error) {
      console.error('Failed to assign machine:', error);
      toast.error('Failed to assign machine: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingAssignment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold">Order Management</h1>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b overflow-x-auto">
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'All Orders' : status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.user?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.actualWeight ? `${order.actualWeight} kg` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.finalAmount ? `₱${order.finalAmount}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {format(new Date(order.createdAt), 'MMM dd, h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {(order.status === 'BOOKED' || order.status === 'AWAITING_WEIGHING') && (
                            <button
                              onClick={() => handleWeighOrder(order.id)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Weigh
                            </button>
                          )}
                          {order.status === 'PAID' && (
                            <button
                              onClick={() => setSelectingMachineType(order.id)}
                              className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                            >
                              Assign
                            </button>
                          )}

                          {/* Quick action: auto-assign machine (reduces navigation).
                              Flow requirement: order must be in a machine processable state.
                              In this app, machine assignment transitions orders to WASHING/DRYING.
                           */}
                          {order.status === 'PAID' && (
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    // Assign only when order is in PAID (ready to start washing)
                                    if (order.status !== 'PAID') {
                                      toast.error('Order must be PAID before assigning to a machine');
                                      return;
                                    }

                                    const machines = machineService.getAllMachines('WASHING').filter(m => m.available);
                                    if (!machines?.length) {
                                      toast.error('No available washers');
                                      return;
                                    }

                                    await orderService.assignMachine(order.id, {
                                      processType: 'WASHING',
                                      machineId: machines[0].id,
                                    });

                                    toast.success('Washer assigned');
                                    fetchOrders();
                                  } catch (error) {
                                    console.error('Auto-assign washer failed:', error);
                                    toast.error('Failed to assign washer');
                                  }
                                }}
                                className="px-2 py-1 bg-purple-700 text-white text-xs rounded hover:bg-purple-800"
                              >
                                Quick Washer
                              </button>
                            </div>
                          )}
                          {order.status === 'AWAITING_PAYMENT' && (
                            <button
                              onClick={async () => {
                                try {
                                  await orderService.confirmPayment(order.id);
                                  toast.success('Payment confirmed!');
                                  fetchOrders();
                                } catch (error) {
                                  toast.error('Failed to confirm payment');
                                }
                              }}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                              Confirm Pay
                            </button>
                          )}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="BOOKED">Booked</option>
                            <option value="AWAITING_WEIGHING">Weighing</option>
                            <option value="AWAITING_PAYMENT">Payment</option>
                            <option value="PAID">Paid</option>
                            <option value="WASHING">Washing</option>
                            <option value="DRYING">Drying</option>
                            <option value="READY_FOR_PICKUP">Pickup</option>
                            <option value="COMPLETED">Done</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Weight Input Modal */}
      {weighingOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Record Order Weight</h2>
            <p className="text-gray-600 mb-4">Order #{weighingOrderId}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={weighingWeight}
                onChange={(e) => setWeighingWeight(e.target.value)}
                placeholder="Enter weight"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setWeighingOrderId(null);
                  setWeighingWeight('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitWeight}
                disabled={submittingWeight}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {submittingWeight ? 'Submitting...' : 'Submit Weight'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Machine Type Selection Modal */}
      {selectingMachineType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-6">Select Machine Type</h2>
            <p className="text-gray-600 mb-6">Order #{selectingMachineType}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => {
                  setAssigningOrderId(selectingMachineType);
                  handleSelectMachineType('WASHING');
                  setSelectingMachineType(null);
                }}
                className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:border-blue-500 transition"
              >
                <div className="font-bold text-blue-700">Washing</div>
                <div className="text-sm text-blue-600">Washing Machine</div>
              </button>
              <button
                onClick={() => {
                  setAssigningOrderId(selectingMachineType);
                  handleSelectMachineType('DRYING');
                  setSelectingMachineType(null);
                }}
                className="p-4 bg-purple-50 border-2 border-purple-300 rounded-lg hover:border-purple-500 transition"
              >
                <div className="font-bold text-purple-700">Drying</div>
                <div className="text-sm text-purple-600">Dryer Machine</div>
              </button>
            </div>

            <button
              onClick={() => setSelectingMachineType(null)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Machine Assignment Modal */}
      {assigningOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Assign Machine to Order</h2>
            <p className="text-gray-600 mb-4">Order #{assigningOrderId} - Machine Type: {assigningMachineType?.replace(/_/g, ' ')}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {availableMachines.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => setSelectedMachine(machine)}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                    selectedMachine?.id === machine.id
                      ? machine.available
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                      : machine.available
                      ? 'border-green-300 bg-green-50 hover:border-green-500'
                      : 'border-red-300 bg-red-50 hover:border-red-500'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{machine.name}</div>
                  <div className="text-xs text-gray-600 mb-2">ID: {machine.id}</div>
                  {machine.available ? (
                    <span className="text-xs text-green-700 font-semibold">✓ Available</span>
                  ) : (
                    <div>
                      <span className="text-xs text-red-700 font-semibold block">✗ Unavailable</span>
                      <span className="text-xs text-red-600">Order {machine.usedByOrder}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {!availableMachines.some(m => m.available) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">
                  ⚠️ No available machines at the moment. All {assigningMachineType === 'WASHING' ? 'washers' : 'dryers'} are currently in use.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAssigningOrderId(null);
                  setAssigningMachineType(null);
                  setAvailableMachines([]);
                  setSelectedMachine(null);
                  setSelectingMachineType(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssignment}
                disabled={submittingAssignment || !selectedMachine?.available}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {submittingAssignment ? 'Assigning...' : 'Assign Machine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;