import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBook, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import API from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/orders?limit=5')
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.orders);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="py-32"><Spinner size="xl" /></div>;

  const statCards = [
    { title: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: FiDollarSign, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: FiShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Books', value: stats?.totalBooks || 0, icon: FiBook, color: 'text-accent-500', bg: 'bg-accent-50' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter page-enter-active">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 font-display">Admin Dashboard</h1>
          <p className="text-gray-500">Store overview and quick links</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-surface-200 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}>
              <card.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-primary-500">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Links */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 p-6">
            <h2 className="font-bold text-lg text-primary-500 mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-accent-400" /> Quick Management
            </h2>
            <div className="space-y-3">
              <Link to="/admin/orders" className="flex items-center justify-between p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors group">
                <div className="flex items-center gap-3 font-medium text-primary-500">
                  <FiShoppingBag className="text-blue-500" /> Manage Orders
                </div>
                <span className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-500 shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {stats?.pendingOrders || 0} Pending
                </span>
              </Link>
              <Link to="/admin/books" className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors font-medium text-primary-500">
                <FiBook className="text-accent-500" /> Manage Inventory
              </Link>
              <Link to="/admin/categories" className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors font-medium text-primary-500">
                <FiUsers className="text-purple-500" /> Manage Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="p-6 border-b border-surface-200 flex justify-between items-center">
              <h2 className="font-bold text-lg text-primary-500">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm font-medium text-accent-500 hover:text-accent-600">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-surface-50">
                      <td className="px-6 py-4 font-medium text-primary-500">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-600">{order.user?.name || order.shippingAddress?.fullName}</td>
                      <td className="px-6 py-4 font-bold text-primary-500">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold
                          ${order.orderStatus === 'Processing' ? 'bg-orange-100 text-orange-600' :
                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' :
                            'bg-red-100 text-red-600'}`
                        }>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No recent orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
