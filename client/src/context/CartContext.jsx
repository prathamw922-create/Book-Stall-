import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    const { data } = await API.post('/cart/add', { bookId, quantity });
    setCart(data);
    return data;
  };

  const updateQuantity = async (bookId, quantity) => {
    const { data } = await API.put('/cart/update', { bookId, quantity });
    setCart(data);
    return data;
  };

  const removeFromCart = async (bookId) => {
    const { data } = await API.delete(`/cart/remove/${bookId}`);
    setCart(data);
    return data;
  };

  const clearCart = async () => {
    await API.delete('/cart/clear');
    setCart({ items: [] });
  };

  const cartItemCount = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const cartTotal = cart.items?.reduce(
    (acc, item) => acc + (item.book?.price || 0) * item.quantity,
    0
  ) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        cartItemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
