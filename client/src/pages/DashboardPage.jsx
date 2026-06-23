import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut, FiMapPin, FiEdit2 } from 'react-icons/fi';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 page-enter page-enter-active">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden sticky top-28">
            <div className="p-6 border-b border-surface-200 text-center">
              <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-accent-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-primary-500 font-display text-lg">{user?.name}</h2>
              <p className="text-gray-500 text-sm truncate">{user?.email}</p>
            </div>
            
            <nav className="p-4 space-y-1">
              <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-accent-50 text-accent-600 rounded-xl font-medium transition-colors">
                <FiUser className="w-5 h-5" /> Account Overview
              </Link>
              <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-surface-100 hover:text-primary-500 rounded-xl font-medium transition-colors">
                <FiPackage className="w-5 h-5" /> My Orders
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-surface-100 hover:text-primary-500 rounded-xl font-medium transition-colors">
                <FiHeart className="w-5 h-5" /> Wishlist
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-surface-100 hover:text-primary-500 rounded-xl font-medium transition-colors">
                <FiSettings className="w-5 h-5" /> Settings
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
                <FiLogOut className="w-5 h-5" /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <h1 className="text-3xl font-bold font-display text-primary-500 mb-6">Account Overview</h1>
          
          {/* Quick Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/orders" className="bg-white p-6 rounded-3xl shadow-sm border border-surface-200 hover:border-accent-400 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiPackage className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-primary-500 text-lg">My Orders</h3>
              <p className="text-gray-500 text-sm mt-1">Track & manage orders</p>
            </Link>
            
            <Link to="/wishlist" className="bg-white p-6 rounded-3xl shadow-sm border border-surface-200 hover:border-red-400 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiHeart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-primary-500 text-lg">Wishlist</h3>
              <p className="text-gray-500 text-sm mt-1">View saved books</p>
            </Link>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="p-6 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary-500">Personal Information</h2>
              <button className="text-accent-400 hover:text-accent-500 font-medium flex items-center gap-2 text-sm">
                <FiEdit2 /> Edit
              </button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="font-medium text-primary-500">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-medium text-primary-500">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                <p className="font-medium text-primary-500">{user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="p-6 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary-500">Saved Addresses</h2>
              <button className="text-accent-400 hover:text-accent-500 font-medium text-sm">
                + Add New
              </button>
            </div>
            <div className="p-6">
              {user?.addresses?.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {user.addresses.map(addr => (
                    <div key={addr._id} className="p-4 rounded-xl border border-surface-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-primary-500 flex items-center gap-2">
                          <FiMapPin className="text-accent-400" /> {addr.fullName}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded">DEFAULT</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
                      <p className="text-sm text-gray-600 mb-2">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm font-medium text-gray-500">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiMapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No addresses saved yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
