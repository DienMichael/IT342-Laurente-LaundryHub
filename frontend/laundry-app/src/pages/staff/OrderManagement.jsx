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
      
      // Auto-update order status based on machine type
      if (assigningMachineType === 'WASHING') {
        await orderService.updateStatus(assigningOrderId, { status: 'WASHING' });
        toast.success('Order moved to Washing');
      } else if (assigningMachineType === 'DRYING') {
        await orderService.updateStatus(assigningOrderId, { status: 'DRYING' });
        toast.success('Order moved to Drying');
      }
      
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
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
                        {order.status === 'WASHING' || order.status === 'DRYING' ? (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                            {order.assignedMachineId ? `#${order.assignedMachineId}` : '-'}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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
                          {order.status === 'WASHING' && (
                            <button
                              onClick={() => setSelectingMachineType(order.id)}
                              className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                            >
                              Pick Dryer
                            </button>
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

            {/* Get the order to determine which machine type buttons to show */}
            {orders.find(o => o.id === selectingMachineType) && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <h3 className="font-semibold text-sm mb-3">Order Information:</h3>
                <div className="text-xs space-y-2">
                  <p><strong>Customer:</strong> {orders.find(o => o.id === selectingMachineType)?.user?.name || 'N/A'}</p>
                  <p><strong>Status:</strong> {orders.find(o => o.id === selectingMachineType)?.status}</p>
                  <p><strong>Weight:</strong> {orders.find(o => o.id === selectingMachineType)?.actualWeight ? `${orders.find(o => o.id === selectingMachineType)?.actualWeight} kg` : 'Not weighed'}</p>
                  <p><strong>Amount:</strong> {orders.find(o => o.id === selectingMachineType)?.finalAmount ? `₱${orders.find(o => o.id === selectingMachineType)?.finalAmount}` : 'N/A'}</p>
                  {orders.find(o => o.id === selectingMachineType)?.status === 'WASHING' && orders.find(o => o.id === selectingMachineType)?.assignedMachineId && (
                    <p className="text-blue-700 font-semibold">🔄 <strong>Current Washer:</strong> Machine #{orders.find(o => o.id === selectingMachineType)?.assignedMachineId}</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {orders.find(o => o.id === selectingMachineType)?.status === 'PAID' && (
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
              )}
              {orders.find(o => o.id === selectingMachineType)?.status === 'WASHING' && (
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
              )}
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

            {/* Order Information Section */}
            {orders.find(o => o.id === assigningOrderId) && (
              <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
                <h3 className="font-semibold text-sm mb-3">Order Details:</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-600">Customer:</p>
                    <p className="font-semibold">{orders.find(o => o.id === assigningOrderId)?.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Weight:</p>
                    <p className="font-semibold">{orders.find(o => o.id === assigningOrderId)?.actualWeight ? `${orders.find(o => o.id === assigningOrderId)?.actualWeight} kg` : 'Not weighed'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount:</p>
                    <p className="font-semibold">₱{orders.find(o => o.id === assigningOrderId)?.finalAmount || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <p className="font-semibold">{orders.find(o => o.id === assigningOrderId)?.status}</p>
                  </div>
                  {orders.find(o => o.id === assigningOrderId)?.status === 'WASHING' && (
                    <div className="col-span-2 bg-blue-100 p-2 rounded">
                      <p className="text-gray-600">Current Washer Assignment:</p>
                      <p className="font-semibold text-blue-900">🔧 Machine #{orders.find(o => o.id === assigningOrderId)?.assignedMachineId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs font-semibold text-yellow-800 mb-1">💡 Assigning: {assigningMachineType}</p>
              <p className="text-xs text-yellow-700">Only available machines are shown below. Machines in use cannot be selected.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {availableMachines.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => setSelectedMachine(machine)}
                  disabled={!machine.available}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                    selectedMachine?.id === machine.id
                      ? machine.available
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                      : machine.available
                      ? 'border-green-300 bg-green-50 hover:border-green-500'
                      : 'border-red-300 bg-red-50 cursor-not-allowed'
                  } ${!machine.available ? 'opacity-60' : ''}`}
                >
                  <div className="font-semibold text-sm mb-1">{machine.name}</div>
                  <div className="text-xs text-gray-600 mb-2">ID: {machine.id}</div>
                  {machine.available ? (
                    <span className="text-xs text-green-700 font-semibold">✓ Available</span>
                  ) : (
                    <div>
                      <span className="text-xs text-red-700 font-semibold block">✗ In Use</span>
                      <span className="text-xs text-red-600">By Order #{machine.usedByOrder}</span>
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