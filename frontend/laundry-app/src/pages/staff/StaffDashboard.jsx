import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { orderService } from '../../services/order.service';
import StatusBadge from '../../components/common/StatusBadge';
import { format } from 'date-fns';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    toast.success('Orders refreshed!');
  };

  const pendingOrders = orders.filter(o =>
    ['BOOKED', 'AWAITING_WEIGHING', 'AWAITING_PAYMENT'].includes(o.status)
  );

  const processingOrders = orders.filter(o =>
    ['PAID', 'WASHING', 'DRYING'].includes(o.status)
  );

  const completedOrders = orders.filter(o =>
    ['READY_FOR_PICKUP', 'COMPLETED'].includes(o.status)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            <ArrowPathIcon size={20} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <p className="text-yellow-800 font-semibold">Pending Orders</p>
            <p className="text-3xl font-bold text-yellow-900">{pendingOrders.length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-blue-800 font-semibold">Processing</p>
            <p className="text-3xl font-bold text-blue-900">{processingOrders.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <p className="text-green-800 font-semibold">Completed</p>
            <p className="text-3xl font-bold text-green-900">{completedOrders.length}</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Pending Orders</h2>
          </div>
          <div className="divide-y">
            {pendingOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No pending orders</div>
            ) : (
              pendingOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy h:mm a')}
                      </p>
                      {order.notes && (
                        <p className="text-sm text-gray-600 mt-1">Note: {order.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status} />
                      <div className="mt-2 space-x-2">
                        {order.status === 'BOOKED' && (
                          <button
                            onClick={() => navigate(`/staff/weigh/${order.id}`)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Weigh Order
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
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Confirm Payment
                          </button>
                        )}
                        {order.status === 'PAID' && (
                          <button
                            onClick={() => navigate(`/staff/assign-machine/${order.id}`)}
                            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                          >
                            Assign Machine
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Processing Orders */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Processing Orders</h2>
          </div>
          <div className="divide-y">
            {processingOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No processing orders</div>
            ) : (
              processingOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy h:mm a')}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Weight:</strong> {order.actualWeight ? `${order.actualWeight} kg` : 'N/A'} | <strong>Amount:</strong> ₱{order.finalAmount || 'N/A'}
                      </p>
                      {/* Machine Assignment Details */}
                      {(order.status === 'WASHING' || order.status === 'DRYING') && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Machine Assignment:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Machine ID:</span>
                              <p className="font-semibold text-blue-900">{order.assignedMachineId || 'Pending'}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Process Type:</span>
                              <p className="font-semibold text-blue-900">{order.status === 'WASHING' ? 'Washer' : 'Dryer'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {order.status === 'PAID' && (
                        <p className="text-xs text-orange-600 mt-2 font-semibold">⏳ Waiting for machine assignment</p>
                      )}
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Completed Orders</h2>
          </div>
          <div className="divide-y">
            {completedOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No completed orders</div>
            ) : (
              completedOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 bg-yellow-50 border-l-4 border-l-blue-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-lg font-bold text-blue-700 mt-1">Owner: {order.user?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy h:mm a')}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Weight: {order.actualWeight ? `${order.actualWeight} kg` : 'N/A'} | Amount: ₱{order.finalAmount || 'N/A'}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;