import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { orderService } from '../../services/order.service';

const CreateBooking = () => {
  const [notes, setNotes] = useState('');
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!estimatedWeight || estimatedWeight <= 0) {
      toast.error('Please enter a valid estimated weight');
      return;
    }

    setLoading(true);
    try {
      const order = await orderService.createBooking({
        estimatedWeight: parseFloat(estimatedWeight),
        notes: notes || null,
      });
      toast.success('Booking created successfully!');
      // backend returns ApiResponse wrapper -> order.id may be undefined
      navigate(`/orders/${order?.id ?? order?._id ?? ''}`);
    } catch (error) {
      // orderService/axios interceptor should already toast, but this ensures a useful message.
      const message = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message;
      toast.error(message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">New Laundry Booking</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={estimatedWeight}
                onChange={(e) => setEstimatedWeight(e.target.value)}
                placeholder="e.g., 2.5"
              />
              <p className="mt-1 text-xs text-gray-500">Final price will be calculated after weighing</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests? (e.g., delicate fabrics, no heat drying, etc.)"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Submit your booking online</li>
                <li>✓ Bring your laundry to our shop</li>
                <li>✓ Staff will weigh your laundry and calculate final price</li>
                <li>✓ Pay at the counter</li>
                <li>✓ Track your order status online</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;