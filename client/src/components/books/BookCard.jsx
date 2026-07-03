import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(book._id);
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    try {
      await addToCart(book._id);
      toast.success(`"${book.title}" added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to use wishlist');
      return;
    }
    try {
      await toggleWishlist(book._id);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link
      to={`/books/${book._id}`}
      className="group card card-hover block"
      id={`book-card-${book._id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-linear-to-b from-surface-100 to-surface-200">
        <img
          src={book.images?.[0] || '/placeholder-book.jpg'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/300x400/1a2744/d4a017?text=${encodeURIComponent(book.title?.charAt(0) || 'B')}`;
          }}
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-primary-500 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-400 hover:text-white transition-colors"
            >
              <FiShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`p-2.5 rounded-lg transition-colors ${
                inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              {inWishlist ? <FaHeart className="w-4 h-4" /> : <FiHeart className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              {discount}% OFF
            </span>
          )}
          {book.isNewArrival && (
            <span className="bg-accent-400 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              NEW
            </span>
          )}
          {book.isBestSeller && (
            <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Stock Status */}
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        {/* Category */}
        {book.category && (
          <p className="text-[10px] font-semibold text-accent-400 uppercase tracking-wider mb-1">
            {book.category.name || book.category}
          </p>
        )}

        {/* Title */}
        <h3 className="font-semibold text-primary-500 text-sm leading-tight line-clamp-2 group-hover:text-accent-400 transition-colors mb-1">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-gray-400 text-xs mb-2">by {book.author}</p>

        {/* Rating */}
        {book.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.round(book.avgRating)
                      ? 'text-accent-400 fill-accent-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({book.numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-500">{formatPrice(book.price)}</span>
          {book.originalPrice && book.originalPrice > book.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(book.originalPrice)}</span>
          )}
        </div>

        {/* Stock indicator */}
        {book.stock > 0 && book.stock <= 5 && (
          <p className="text-[10px] text-orange-500 font-medium mt-1">Only {book.stock} left!</p>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
