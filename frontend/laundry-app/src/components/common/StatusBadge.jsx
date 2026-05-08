const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-blue-100 text-blue-800';
      case 'AWAITING_WEIGHING':
        return 'bg-yellow-100 text-yellow-800';
      case 'AWAITING_PAYMENT':
        return 'bg-orange-100 text-orange-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'WASHING':
        return 'bg-indigo-100 text-indigo-800';
      case 'DRYING':
        return 'bg-purple-100 text-purple-800';
      case 'READY_FOR_PICKUP':
        return 'bg-emerald-100 text-emerald-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
