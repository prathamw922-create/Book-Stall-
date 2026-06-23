import { useState, useEffect } from 'react';
import { FiEye, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { formatPrice, formatDateTime } from '../../utils/formatPrice';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="py-32"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter page-enter-active">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-500 font-display">Manage Orders</h1>
        <p className="text-gray-500">View and update customer order statuses</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order details</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-surface-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-primary-500">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary-500">{order.shippingAddress?.fullName}</p>
                    <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {order.items.length} items
                  </td>
                  <td className="px-6 py-4 font-bold text-primary-500">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updating}
                      className={`text-sm rounded-lg border font-semibold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-400 ${
                        order.orderStatus === 'Processing' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                        order.orderStatus === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                        order.orderStatus === 'Delivered' ? 'bg-green-50 border-green-200 text-green-600' :
                        'bg-red-50 border-red-200 text-red-600'
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
