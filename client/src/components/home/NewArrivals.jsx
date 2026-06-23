import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import BookCard from '../books/BookCard';
import API from '../../services/api';
import Spinner from '../ui/Spinner';

const NewArrivals = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { data } = await API.get('/books/new-arrivals');
        setBooks(data);
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (books.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 bg-linear-to-b from-surface-50 to-white relative overflow-hidden" id="new-arrivals">
      <div className="absolute -right-32 bottom-32 w-80 h-80 bg-primary-100/50 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-16 animate-slide-up">
          <div>
            <p className="text-accent-500 font-bold text-sm uppercase tracking-widest mb-3">Just Arrived</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-500 font-display mb-4">New Arrivals</h2>
            <div className="w-24 h-1 bg-linear-to-r from-accent-400 to-accent-300 rounded-full mb-4" />
            <p className="text-gray-500 text-lg">Fresh additions to our curated collection.</p>
          </div>
          <Link
            to="/books?filter=new-arrivals"
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
          <Link to="/books?filter=new-arrivals" className="btn-accent inline-flex items-center gap-2">
            View All New Arrivals <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
