import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, FiInfo } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import Spinner from '../components/ui/Spinner';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  if (loading && !cart.items) {
    return <div className="py-32"><Spinner size="xl" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 page-enter page-enter-active">
        <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-surface-200 max-w-md w-full">
          <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <FiShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-primary-500 mb-4">Sign in to view cart</h2>
          <p className="text-gray-500 mb-8">You need to be logged in to view your cart items and checkout.</p>
          <Link to="/login" className="btn-primary w-full inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  if (cart.items?.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 page-enter page-enter-active">
        <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-surface-200 max-w-lg w-full">
          <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <img src="/empty-cart.png" alt="Empty Cart" className="w-16 h-16 opacity-50 grayscale" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <FiShoppingBag className="w-12 h-12 text-gray-300 hidden" />
          </div>
          <h2 className="text-3xl font-bold font-display text-primary-500 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any books to your cart yet. Discover your next great read!</p>
          <Link to="/books" className="btn-primary inline-flex items-center gap-2">
            Browse Books <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  const deliveryCharge = cartTotal >= 500 ? 0 : 50;
  const grandTotal = cartTotal + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 page-enter page-enter-active">
      <h1 className="text-3xl font-bold font-display text-primary-500 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="p-6 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-semibold text-primary-500">Cart Items ({cart.items?.length})</h2>
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <FiTrash2 /> Clear Cart
              </button>
            </div>

            <div className="divide-y divide-surface-200">
              {cart.items?.map((item) => (
                <div key={item.book._id} className="p-6 flex flex-col sm:flex-row gap-6">
                  {/* Image */}
                  <Link to={`/books/${item.book._id}`} className="shrink-0 w-24 sm:w-32 aspect-3/4 rounded-lg overflow-hidden border border-surface-200 hover:shadow-md transition-all">
                    <img
                      src={item.book.images?.[0] || '/placeholder-book.jpg'}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/200x300/1a2744/d4a017?text=${encodeURIComponent(item.book.title?.charAt(0) || 'B')}`;
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <Link to={`/books/${item.book._id}`} className="font-semibold text-primary-500 text-lg hover:text-accent-400 transition-colors line-clamp-2">
                          {item.book.title}
                        </Link>
                        <p className="text-sm text-gray-500 mb-1">by {item.book.author}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary-500 text-lg">{formatPrice(item.book.price)}</p>
                        {item.book.originalPrice > item.book.price && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(item.book.originalPrice)}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden bg-surface-50">
                        <button
                          onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || loading}
                          className="p-2 text-gray-600 hover:bg-surface-200 disabled:opacity-50 transition-colors"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-primary-500 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                          disabled={item.quantity >= item.book.stock || loading}
                          className="p-2 text-gray-600 hover:bg-surface-200 disabled:opacity-50 transition-colors"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.book._id)}
                        disabled={loading}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {item.quantity >= item.book.stock && (
                      <p className="text-xs text-orange-500 mt-2">Maximum stock reached</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 p-6 lg:p-8 sticky top-28">
            <h2 className="font-bold text-xl text-primary-500 mb-6 font-display">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-600 border-b border-surface-200 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items?.length} items)</span>
                <span className="font-medium text-primary-500">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-medium text-primary-500">
                  {deliveryCharge === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(deliveryCharge)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg text-primary-500">Grand Total</span>
              <span className="font-bold text-2xl text-primary-500">{formatPrice(grandTotal)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-accent py-4 text-lg flex items-center justify-center gap-2 mb-4"
            >
              Proceed to Checkout <FiArrowRight />
            </button>

            <div className="flex items-start gap-3 p-4 bg-surface-50 rounded-xl">
              <FiInfo className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                You will only pay <strong className="text-primary-500">Cash on Delivery</strong>. Free delivery on orders above ₹500.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
