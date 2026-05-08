import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/order.service';
import OrderCard from '../../components/orders/OrderCard';
import { PlusIcon, ClipboardDocumentListIcon, ClockIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orders = await orderService.getMyOrders();
      setRecentOrders(orders.slice(0, 5));
      setStats({
        total: orders.length,
        active: orders.filter(o => !['COMPLETED', 'READY_FOR_PICKUP'].includes(o.status)).length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-blue-100 mb-6">Your laundry, done smart and fast</p>
          <button
            onClick={() => navigate('/booking')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            New Booking
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-orange-600">{stats.active}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders yet</p>
                <button
                  onClick={() => navigate('/booking')}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Create your first order →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;