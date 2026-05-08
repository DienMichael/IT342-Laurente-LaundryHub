import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { orderService } from '../../services/order.service';
import StatusBadge from '../../components/common/StatusBadge';
import OrderTimeline from '../../components/orders/OrderTimeline';
import { format } from 'date-fns';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(parseInt(id));
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">Order #{order.id}</h1>
              <p className="text-gray-500 text-sm mt-1">
                Created: {format(new Date(order.createdAt), 'MMMM dd, yyyy h:mm a')}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {order.actualWeight && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-semibold">{order.actualWeight} kg</p>
              </div>
              {order.finalAmount && (
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-blue-600">₱{order.finalAmount.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {order.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Special Instructions</p>
              <p className="text-gray-700 italic">"{order.notes}"</p>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <OrderTimeline currentStatus={order.status} />
      </div>
    </div>
  );
};

export default OrderTracking;