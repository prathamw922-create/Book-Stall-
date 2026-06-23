import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiMapPin, FiArrowLeft, FiShoppingBag, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import Spinner from '../components/ui/Spinner';
import { validatePhone, validatePincode } from '../utils/validators';
import { generateOrderWhatsAppMessage, openWhatsApp } from '../utils/whatsapp';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { cart, loading: cartLoading, cartTotal, fetchCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: true
  });

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (!cartLoading && (!cart.items || cart.items.length === 0)) {
      navigate('/cart');
    }

    if (user?.addresses) {
      setAddresses(user.addresses);
      const defaultAddr = user.addresses.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
      } else if (user.addresses.length > 0) {
        setSelectedAddressId(user.addresses[0]._id);
      }
    }
  }, [cart.items, cartLoading, navigate, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  const validateForm = () => {
    if (selectedAddressId === 'new') {
      if (!formData.fullName.trim() || !formData.address.trim() || !formData.city.trim() || !formData.state.trim()) {
        toast.error('Please fill all required address fields');
        return false;
      }
      if (!validatePhone(formData.phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return false;
      }
      if (!validatePincode(formData.pincode)) {
        toast.error('Please enter a valid 6-digit pincode');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let finalAddress;

      if (selectedAddressId === 'new') {
        const addressToSave = {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        };

        // Save address if checked
        if (formData.saveAddress) {
          const { data } = await API.post('/users/address', addressToSave);
          // Update local user state to reflect new address
          const updatedUser = { ...user, addresses: data };
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        
        finalAddress = { ...addressToSave, email: formData.email };
      } else {
        const selectedAddress = addresses.find(a => a._id === selectedAddressId);
        finalAddress = {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          email: formData.email || user.email,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        };
      }

      // Place order
      const { data: order } = await API.post('/orders', {
        shippingAddress: finalAddress,
      });

      // Show success, open WhatsApp, and navigate
      toast.success('Order placed successfully!');
      
      // Update cart context
      await fetchCart();

      // Open WhatsApp
      const waMessage = generateOrderWhatsAppMessage(order);
      openWhatsApp(waMessage);

      // Navigate to confirmation page
      navigate(`/order-confirmation/${order._id}`, { replace: true });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading || !cart.items) return <div className="py-32"><Spinner size="xl" /></div>;

  const deliveryCharge = cartTotal >= 500 ? 0 : 50;
  const grandTotal = cartTotal + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 page-enter page-enter-active">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="p-2 text-gray-400 hover:text-primary-500 hover:bg-surface-100 rounded-full transition-colors">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold font-display text-primary-500">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Forms */}
        <div className="flex-1 space-y-8">
          
          {/* Saved Addresses */}
          {addresses.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-surface-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-primary-500 mb-6 flex items-center gap-2">
                <FiMapPin className="text-accent-400" /> Select Delivery Address
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div
                    key={addr._id}
                    onClick={() => handleAddressSelect(addr._id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr._id
                        ? 'border-accent-400 bg-accent-50'
                        : 'border-surface-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-primary-500">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded">DEFAULT</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
                    <p className="text-sm text-gray-600 mb-2">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <FiCheckCircle className={`w-4 h-4 ${selectedAddressId === addr._id ? 'text-accent-500' : 'text-gray-300'}`} />
                      {addr.phone}
                    </p>
                  </div>
                ))}
                
                <div
                  onClick={() => handleAddressSelect('new')}
                  className={`p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all flex items-center justify-center min-h-[140px] ${
                    selectedAddressId === 'new'
                      ? 'border-accent-400 bg-accent-50 text-accent-600'
                      : 'border-surface-300 text-gray-500 hover:border-primary-300 hover:text-primary-500'
                  }`}
                >
                  <span className="font-medium">+ Add New Address</span>
                </div>
              </div>
            </div>
          )}

          {/* New Address Form */}
          {selectedAddressId === 'new' && (
            <div className="bg-white rounded-3xl shadow-sm border border-surface-200 p-6 lg:p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-primary-500 mb-6 flex items-center gap-2">
                <FiTruck className="text-accent-400" /> New Delivery Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field pl-12"
                      placeholder="10-digit number"
                      maxLength="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="For order updates"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field resize-none"
                    placeholder="House No, Building, Street, Area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="6-digit pincode"
                    maxLength="6"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveAddress"
                  name="saveAddress"
                  checked={formData.saveAddress}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-accent-400 rounded border-gray-300 focus:ring-accent-400"
                />
                <label htmlFor="saveAddress" className="text-sm text-gray-600">
                  Save this address for future orders
                </label>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-primary-500 mb-6">Payment Method</h2>
            <div className="p-4 rounded-xl border-2 border-accent-400 bg-accent-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="w-6 h-6 text-accent-500" />
                <div>
                  <p className="font-semibold text-primary-700">Cash on Delivery (COD)</p>
                  <p className="text-xs text-primary-600">Pay when your order arrives</p>
                </div>
              </div>
              <img src="https://cdn-icons-png.flaticon.com/512/2897/2897785.png" alt="COD" className="w-10 opacity-70" />
            </div>
          </div>

        </div>

        {/* Right: Summary */}
        <div className="lg:w-[400px] shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 p-6 lg:p-8 sticky top-28">
            <h2 className="font-bold text-xl text-primary-500 mb-6 font-display flex items-center gap-2">
              <FiShoppingBag className="text-accent-400" /> Order Summary
            </h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {cart.items.map((item) => (
                <div key={item.book._id} className="flex gap-4 items-start">
                  <div className="w-12 h-16 shrink-0 rounded overflow-hidden border border-surface-200">
                    <img src={item.book.images?.[0] || '/placeholder-book.jpg'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-500 truncate">{item.book.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-primary-500">{formatPrice(item.book.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm text-gray-600 border-t border-b border-surface-200 py-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
              <span className="font-bold text-2xl text-accent-500">{formatPrice(grandTotal)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || cart.items.length === 0}
              className="w-full btn-accent py-4 text-lg flex items-center justify-center gap-2 relative group overflow-hidden"
            >
              <span className="relative z-10">{loading ? 'Processing...' : 'Place Order Now'}</span>
              {!loading && (
                <div className="absolute inset-0 h-full w-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              By placing the order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
