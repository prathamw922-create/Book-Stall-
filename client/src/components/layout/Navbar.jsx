import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiLogOut, FiPackage, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-accent-300 font-bold text-lg font-display">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary-500 font-display leading-tight">
                Aura<span className="text-accent-400">Reads</span>
              </h1>
              <p className="text-[10px] text-gray-400 -mt-1 tracking-wider uppercase">Your Book Store</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors..."
                className="w-full pl-4 pr-12 py-2.5 border border-surface-200 rounded-full bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400 transition-all text-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
              >
                <FiSearch className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            {user && (
              <Link
                to="/wishlist"
                className="relative p-2.5 text-gray-600 hover:text-accent-400 hover:bg-accent-50 rounded-full transition-all"
                title="Wishlist"
              >
                <FiHeart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-600 hover:text-accent-400 hover:bg-accent-50 rounded-full transition-all"
              title="Cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-slow">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-500 hover:bg-surface-100 rounded-full transition-all"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <FiChevronDown className={`w-4 h-4 hidden sm:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-surface-200 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-surface-100">
                        <p className="font-semibold text-primary-500 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-surface-50 hover:text-primary-500 transition-colors">
                        <FiUser className="w-4 h-4" /> My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-surface-50 hover:text-primary-500 transition-colors">
                        <FiPackage className="w-4 h-4" /> My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-surface-50 hover:text-primary-500 transition-colors">
                        <FiHeart className="w-4 h-4" /> Wishlist
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-accent-500 hover:bg-accent-50 transition-colors font-medium">
                          <FiPackage className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-surface-100" />
                      <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-full text-sm font-semibold hover:bg-primary-600 hover:shadow-lg transition-all active:scale-95"
              >
                <FiUser className="w-4 h-4" /> Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-primary-500 hover:bg-surface-100 rounded-full transition-all"
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-8 pb-3 -mt-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/books', label: 'All Books' },
            { to: '/books?filter=new-arrivals', label: 'New Arrivals' },
            { to: '/books?filter=bestsellers', label: 'Best Sellers' },
            { to: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors relative group ${
                (link.to.includes('?') ? location.pathname + location.search === link.to : location.pathname === link.to && !location.search)
                  ? 'text-accent-400'
                  : 'text-gray-500 hover:text-primary-500'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent-400 transition-all ${
                (link.to.includes('?') ? location.pathname + location.search === link.to : location.pathname === link.to && !location.search) ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-surface-200 animate-slide-up">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full pl-4 pr-10 py-3 border border-surface-200 rounded-xl bg-surface-50 focus:outline-none focus:ring-2 focus:ring-accent-400/50 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </form>
            {[
              { to: '/', label: 'Home' },
              { to: '/books', label: 'All Books' },
              { to: '/books?filter=new-arrivals', label: 'New Arrivals' },
              { to: '/books?filter=bestsellers', label: 'Best Sellers' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-3 px-2 text-gray-600 hover:text-primary-500 border-b border-surface-100 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                to="/login"
                className="block mt-4 text-center py-3 bg-primary-500 text-white rounded-xl text-sm font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
