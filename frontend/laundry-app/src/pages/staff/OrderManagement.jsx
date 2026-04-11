import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/order.service';
import StatusBadge from '../../components/Common/StatusBadge';
import { format } from 'date-fns';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
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
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
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
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="BOOKED">Booked</option>
                          <option value="AWAITING_WEIGHING">Awaiting Weighing</option>
                          <option value="AWAITING_PAYMENT">Awaiting Payment</option>
                          <option value="PAID">Paid</option>
                          <option value="WASHING">Washing</option>
                          <option value="DRYING">Drying</option>
                          <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;