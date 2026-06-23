import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import BookCard from '../books/BookCard';
import API from '../../services/api';
import Spinner from '../ui/Spinner';

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/books/featured');
        setBooks(data);
      } catch (err) {
        console.error('Failed to fetch featured books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (books.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 bg-linear-to-b from-white to-surface-50 relative overflow-hidden" id="featured-books">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary-50/50 to-transparent pointer-events-none" />
      <div className="absolute -left-32 top-32 w-64 h-64 bg-accent-100 rounded-full blur-[80px] opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <p className="text-accent-500 font-bold text-sm uppercase tracking-widest mb-3">Handpicked for You</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-500 font-display mb-4">Featured Books</h2>
          <div className="w-24 h-1 bg-linear-to-r from-accent-400 to-accent-300 mx-auto rounded-full mb-6" />
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Our most loved and recommended reads selected by our experts.</p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="pb-14"
        >
          {books.map((book) => (
            <SwiperSlide key={book._id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedBooks;
