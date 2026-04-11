import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/order.service';
import toast from 'react-hot-toast';

const WeighOrder = () => {
  const { id } = useParams();
  const [actualWeight, setActualWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(parseInt(id));
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order');
      navigate('/staff');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!actualWeight || actualWeight <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    setLoading(true);
    try {
      await orderService.weighOrder(parseInt(id), { actualWeight: parseFloat(actualWeight) });
      toast.success('Order weighed and price calculated!');
      navigate('/staff');
    } catch (error) {
      toast.error('Failed to weigh order');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pricePerKg = 50;
  const estimatedTotal = actualWeight ? parseFloat(actualWeight) * pricePerKg : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Weigh Order #{id}</h1>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Notes:</p>
            <p className="text-gray-800">{order.notes || 'No special instructions'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={actualWeight}
                onChange={(e) => setActualWeight(e.target.value)}
                placeholder="Enter weight in kilograms"
              />
            </div>

            {actualWeight && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 mb-2">Price Calculation:</p>
                <p className="text-blue-900 font-semibold">
                  {actualWeight} kg × ₱{pricePerKg}/kg = ₱{estimatedTotal.toFixed(2)}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/staff')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Weight & Price'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WeighOrder;