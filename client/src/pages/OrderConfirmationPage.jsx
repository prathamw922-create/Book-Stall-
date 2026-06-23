import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight, FiDownload } from 'react-icons/fi';
import API from '../services/api';
import { formatPrice, formatDateTime } from '../utils/formatPrice';
import Spinner from '../components/ui/Spinner';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="py-32"><Spinner size="xl" /></div>;
  if (error || !order) return <div className="py-32 text-center text-red-500">{error || 'Order not found'}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 page-enter page-enter-active">
      <div className="text-center mb-12 animate-slide-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold font-display text-primary-500 mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-2">Thank you for shopping with Aura Reads.</p>
        <p className="text-sm text-gray-500">Your order number is <span className="font-bold text-primary-500">{order.orderNumber}</span></p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
        {/* Order Header Info */}
        <div className="p-6 sm:p-8 bg-surface-50 border-b border-surface-200 flex flex-wrap gap-6 justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">Date Placed</p>
            <p className="font-medium text-primary-500">{formatDateTime(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="font-bold text-accent-500">{formatPrice(order.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment Method</p>
            <p className="font-medium text-primary-500">Cash on Delivery</p>
          </div>
          {/* Mock invoice download button */}
          <button className="text-accent-400 hover:text-accent-500 font-medium flex items-center gap-2 text-sm transition-colors">
            <FiDownload /> Invoice
          </button>
        </div>

        {/* Order Items */}
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-primary-500 mb-6 flex items-center gap-2">
            <FiPackage className="text-accent-400" /> Items Ordered
          </h2>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item._id} className="flex gap-4">
                <div className="w-16 h-24 rounded border border-surface-200 overflow-hidden shrink-0">
                  <img
                    src={item.book.images?.[0] || '/placeholder-book.jpg'}
                    alt={item.book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${item.book._id}`} className="font-semibold text-primary-500 hover:text-accent-400 transition-colors line-clamp-2">
                    {item.book.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                  <p className="font-medium text-primary-500 mt-1">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="p-6 sm:p-8 border-t border-surface-200 bg-surface-50 grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-primary-500 mb-3 text-sm uppercase tracking-wider">Delivery Address</h3>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="font-medium text-primary-500">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-primary-500 mb-3 text-sm uppercase tracking-wider">Order Updates</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We've sent the order details to your registered email and WhatsApp number. You can track your order status in your dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <Link to="/orders" className="btn-outline w-full sm:w-auto">
          View All Orders
        </Link>
        <Link to="/books" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
          Continue Shopping <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
