import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiChevronRight, FiMinus, FiPlus, FiBook, FiInfo } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, formatDateTime } from '../utils/formatPrice';
import Spinner from '../components/ui/Spinner';
import BookCard from '../components/books/BookCard';
import toast from 'react-hot-toast';

const BookDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Review Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [bookRes, relatedRes, reviewsRes] = await Promise.all([
          API.get(`/books/${id}`),
          API.get(`/books/${id}/related`),
          API.get(`/reviews/${id}`)
        ]);

        setBook(bookRes.data);
        setRelatedBooks(relatedRes.data);
        setReviews(reviewsRes.data);

        // Add to recently viewed if logged in
        if (user) {
          API.post('/users/recently-viewed', { bookId: id }).catch(console.error);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) return toast.error('Please sign in to add items to cart');
    try {
      await addToCart(book._id, quantity);
      toast.success(`${quantity} ${quantity > 1 ? 'copies' : 'copy'} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) return toast.error('Please sign in to use wishlist');
    try {
      await toggleWishlist(book._id);
      toast.success(isInWishlist(book._id) ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a rating');

    try {
      setSubmittingReview(true);
      const { data } = await API.post('/reviews', {
        bookId: book._id,
        rating,
        comment
      });
      setReviews([data, ...reviews]);
      setRating(0);
      setComment('');
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast.success('Review deleted');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <div className="py-32"><Spinner size="xl" /></div>;
  if (error) return <div className="py-32 text-center text-red-500">{error}</div>;
  if (!book) return null;

  const inWishlist = isInWishlist(book._id);
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;
  const images = book.images?.length > 0 ? book.images : ['/placeholder-book.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter page-enter-active">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary-500">Home</Link>
        <FiChevronRight className="w-4 h-4" />
        <Link to="/books" className="hover:text-primary-500">Books</Link>
        <FiChevronRight className="w-4 h-4" />
        <Link to={`/books?category=${book.category?._id}`} className="hover:text-primary-500">{book.category?.name}</Link>
        <FiChevronRight className="w-4 h-4" />
        <span className="text-primary-500 font-medium truncate">{book.title}</span>
      </nav>

      <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden mb-12">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left: Images */}
          <div className="p-8 lg:p-12 bg-surface-50 flex flex-col items-center border-r border-surface-200">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden shadow-2xl mb-6">
              <img
                src={images[activeImage]}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x600/1a2744/d4a017?text=${encodeURIComponent(book.title?.charAt(0) || 'B')}`;
                }}
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto custom-scrollbar p-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-28 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-accent-400 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="mb-2">
              <span className="text-accent-400 font-semibold text-sm uppercase tracking-wider">
                {book.category?.name}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-500 font-display mb-2">
              {book.title}
            </h1>
            
            <p className="text-lg text-gray-500 mb-6">by <span className="font-semibold text-primary-500">{book.author}</span></p>

            {/* Ratings & Reviews Link */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-surface-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(book.avgRating) ? 'text-accent-400 fill-accent-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-primary-500 font-semibold">{book.avgRating} / 5</span>
              <span className="text-gray-300">|</span>
              <a href="#reviews" className="text-gray-500 hover:text-accent-400 transition-colors">
                {book.numReviews} Reviews
              </a>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-bold text-primary-500">
                {formatPrice(book.price)}
              </span>
              {book.originalPrice > book.price && (
                <span className="text-xl text-gray-400 line-through mb-1">
                  {formatPrice(book.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8 text-gray-600 leading-relaxed">
              <p>{book.description || 'No description available for this book.'}</p>
            </div>

            {/* Actions */}
            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium text-primary-500">Quantity:</span>
                <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-surface-50 hover:bg-surface-100 text-gray-600 transition-colors"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-medium text-primary-500">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    disabled={quantity >= book.stock}
                    className="px-4 py-2 bg-surface-50 hover:bg-surface-100 text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <FiPlus />
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  {book.stock > 0 ? (
                    <span className="text-emerald-600 font-medium">{book.stock} in stock</span>
                  ) : (
                    <span className="text-red-500 font-medium">Out of stock</span>
                  )}
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="flex-1 btn-accent flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`px-6 py-4 rounded-lg border-2 flex items-center justify-center transition-all ${
                    inWishlist 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-surface-200 hover:border-primary-500 text-gray-400 hover:text-primary-500'
                  }`}
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {inWishlist ? <FaHeart className="w-6 h-6" /> : <FiHeart className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Specs */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-surface-200">
          <h2 className="text-2xl font-bold font-display text-primary-500 mb-6 flex items-center gap-2">
            <FiInfo className="w-6 h-6 text-accent-400" /> Book Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex items-center justify-between py-3 border-b border-surface-100">
              <span className="text-gray-500">Publisher</span>
              <span className="font-medium text-primary-500 text-right">{book.publisher || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-surface-100">
              <span className="text-gray-500">Publication Year</span>
              <span className="font-medium text-primary-500">{book.publishedYear || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-surface-100">
              <span className="text-gray-500">ISBN</span>
              <span className="font-medium text-primary-500">{book.isbn || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-surface-100">
              <span className="text-gray-500">Pages</span>
              <span className="font-medium text-primary-500">{book.pages || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-surface-100">
              <span className="text-gray-500">Language</span>
              <span className="font-medium text-primary-500">{book.language || 'English'}</span>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-surface-50 rounded-3xl p-8 border border-surface-200">
          <h3 className="font-bold text-primary-500 mb-6">Why buy from us?</h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-accent-400">
                <FiShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-primary-500 text-sm">Cash on Delivery</h4>
                <p className="text-gray-500 text-xs mt-1">Pay conveniently at your doorstep</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-accent-400">
                <FiBook className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-primary-500 text-sm">Original Books</h4>
                <p className="text-gray-500 text-xs mt-1">100% genuine and original copies</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews" className="bg-white rounded-3xl shadow-sm border border-surface-200 p-8 lg:p-12 mb-16">
        <h2 className="text-2xl font-bold font-display text-primary-500 mb-8">Customer Reviews</h2>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Review Stats & Form */}
          <div className="lg:col-span-1">
            <div className="bg-surface-50 p-6 rounded-2xl mb-8 text-center">
              <span className="text-5xl font-bold text-primary-500 block mb-2">{book.avgRating}</span>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(book.avgRating) ? 'text-accent-400 fill-accent-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm">Based on {book.numReviews} reviews</p>
            </div>

            {user ? (
              <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
                <h3 className="font-bold text-primary-500 mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none"
                      >
                        <FiStar
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-accent-400 fill-accent-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field resize-none"
                    placeholder="What did you think of the book?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview || !rating}
                  className="w-full btn-primary py-2 text-sm disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="bg-surface-50 p-6 rounded-2xl text-center border border-surface-200">
                <p className="text-gray-600 mb-4 text-sm">Sign in to write a review</p>
                <Link to="/login" className="btn-outline px-4 py-2 text-sm inline-block w-full text-center">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No reviews yet. Be the first to review this book!
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="pb-6 border-b border-surface-200 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-accent-400 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-primary-500 text-sm">{review.user?.name}</p>
                        <p className="text-xs text-gray-400">{formatDateTime(review.createdAt)}</p>
                      </div>
                    </div>
                    {user && (user._id === review.user?._id || user.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:text-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating ? 'text-accent-400 fill-accent-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold font-display text-primary-500 mb-6">Similar Books</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedBooks.slice(0, 6).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
