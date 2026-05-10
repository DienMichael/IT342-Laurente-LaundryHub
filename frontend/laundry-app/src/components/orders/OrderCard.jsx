import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import StatusBadge from '../common/StatusBadge';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="text-lg font-semibold text-gray-900">#{order.id}</p>
          {order.user?.name && (
            <p className="text-sm text-gray-600 mt-2">Owner: <span className="font-medium">{order.user.name}</span></p>
          )}
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Placed</p>
          <p className="text-sm font-medium text-gray-900">
            {order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy') : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Weight</p>
          <p className="text-sm font-medium text-gray-900">
            {order.actualWeight ? `${order.actualWeight} kg` : 'Pending'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
          <p className="text-sm font-medium text-gray-900">
            {order.finalAmount ? `$${parseFloat(order.finalAmount).toFixed(2)}` : 'Pending'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pricing</p>
          <p className="text-sm font-medium text-gray-900">
            {order.pricingStatus === 'FINALIZED' ? 'Finalized' : 'Pending'}
          </p>
        </div>
      </div>

      {order.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600 font-medium mb-1">Notes</p>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
