import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../../services/order.service';
import StatusBadge from '../../components/Common/StatusBadge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

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

  const statusSteps = [
    { key: 'BOOKED', label: 'Booked', description: 'Order received' },
    { key: 'AWAITING_WEIGHING', label: 'Awaiting Weighing', description: 'Bring laundry to shop' },
    { key: 'AWAITING_PAYMENT', label: 'Awaiting Payment', description: 'Payment pending' },
    { key: 'PAID', label: 'Paid', description: 'Payment confirmed' },
    { key: 'WASHING', label: 'Washing', description: 'In washing machine' },
    { key: 'DRYING', label: 'Drying', description: 'In dryer' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', description: 'Ready to collect' },
    { key: 'COMPLETED', label: 'Completed', description: 'Order completed' },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === order?.status);
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Order Status Timeline</h2>
          <div className="relative">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= getCurrentStepIndex();
              const isCurrent = index === getCurrentStepIndex();

              return (
                <div key={step.key} className="flex mb-8 last:mb-0">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-white text-sm">{index + 1}</span>
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-12 mt-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;