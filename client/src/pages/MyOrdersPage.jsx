import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight, FiClock, FiCheckCircle } from 'react-icons/fi';
import API from '../services/api';
import { formatPrice, formatDateTime } from '../utils/formatPrice';
import Spinner from '../components/ui/Spinner';

const getStatusColor = (status) => {
  switch (status) {
    case 'Processing': return 'text-orange-500 bg-orange-50 border-orange-200';
    case 'Shipped': return 'text-blue-500 bg-blue-50 border-blue-200';
    case 'Delivered': return 'text-green-500 bg-green-50 border-green-200';
    case 'Cancelled': return 'text-red-500 bg-red-50 border-red-200';
    default: return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 page-enter page-enter-active">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
          <FiPackage className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display text-primary-500">My Orders</h1>
          <p className="text-gray-500">Track and manage your past purchases</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-surface-200 shadow-sm">
          <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold font-display text-primary-500 mb-4">No orders yet</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't made your first purchase yet.</p>
          <Link to="/books" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden group hover:border-primary-300 transition-colors">
              <div className="p-6 bg-surface-50 border-b border-surface-200 flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="font-semibold text-primary-500 flex items-center gap-1.5">
                    <FiClock className="w-4 h-4 text-accent-400" />
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total</p>
                  <p className="font-bold text-primary-500">{formatPrice(order.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order #</p>
                  <p className="font-medium text-primary-500">{order.orderNumber}</p>
                </div>
                <div>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border flex items-center gap-1.5 ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus === 'Delivered' && <FiCheckCircle />}
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex gap-4 items-start">
                      <div className="w-16 h-24 rounded overflow-hidden border border-surface-200 shrink-0">
                        <img 
                          src={item.book.images?.[0] || '/placeholder-book.jpg'} 
                          alt={item.book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/books/${item.book._id}`} className="font-semibold text-primary-500 hover:text-accent-400 transition-colors text-lg line-clamp-1">
                          {item.book.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <p className="font-medium text-primary-500 mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-surface-200 flex justify-end">
                  <Link to={`/order-confirmation/${order._id}`} className="text-accent-500 font-semibold hover:text-accent-600 flex items-center gap-1">
                    View Order Details <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
