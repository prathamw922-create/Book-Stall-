import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import BookCard from '../books/BookCard';
import API from '../../services/api';
import Spinner from '../ui/Spinner';

const BestSellers = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data } = await API.get('/books/bestsellers');
        setBooks(data);
      } catch (err) {
        console.error('Failed to fetch best sellers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (books.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden" id="bestsellers">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent-50/40 via-white to-white pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-16 animate-slide-up">
          <div>
            <p className="text-accent-500 font-bold text-sm uppercase tracking-widest mb-3">Top Rated</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-500 font-display mb-4">Best Sellers</h2>
            <div className="w-24 h-1 bg-linear-to-r from-accent-400 to-accent-300 rounded-full mb-4" />
            <p className="text-gray-500 text-lg">Books that everyone is talking about.</p>
          </div>
          <Link
            to="/books?filter=bestsellers"
            className="hidden sm:flex items-center gap-2 text-accent-400 font-semibold hover:text-accent-500 transition-colors group"
          >
            View All
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {books.slice(0, 10).map((book, index) => (
            <div key={book._id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <BookCard book={book} />
            </div>
          ))}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link to="/books?filter=bestsellers" className="btn-primary inline-flex items-center gap-2">
            View All Best Sellers <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
