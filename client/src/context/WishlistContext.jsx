import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/users/wishlist');
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (bookId) => {
    const { data } = await API.post(`/users/wishlist/${bookId}`);
    setWishlist(data);
    return data;
  };

  const isInWishlist = (bookId) => {
    return wishlist.some((item) => (item._id || item) === bookId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, toggleWishlist, isInWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
