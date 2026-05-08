import React from 'react';

const OrderTimeline = ({ currentStatus }) => {
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
    return statusSteps.findIndex(step => step.key === currentStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Order Status Timeline</h2>
      <div className="relative">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= getCurrentStepIndex();
          const isCurrent = index === getCurrentStepIndex();

          return (
            <div key={step.key} className="flex mb-8 last:mb-0">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 transition-colors ${
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
  );
};

export default OrderTimeline;
