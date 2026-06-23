import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import BookCard from '../components/books/BookCard';
import Spinner from '../components/ui/Spinner';

const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 page-enter page-enter-active">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
          <FiHeart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display text-primary-500">My Wishlist</h1>
          <p className="text-gray-500">{wishlist.length} items saved</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-surface-200 shadow-sm">
          <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiHeart className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold font-display text-primary-500 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love and buy them later.</p>
          <Link to="/books" className="btn-primary inline-flex items-center gap-2">
            Explore Books <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {wishlist.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
