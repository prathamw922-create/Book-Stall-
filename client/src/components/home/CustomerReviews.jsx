import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FiStar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Avid Reader',
    rating: 5,
    text: 'Absolutely love the collection here! The delivery was super fast and the books arrived in perfect condition. The cash on delivery option makes it so convenient.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Student',
    rating: 5,
    text: 'Found some rare academic books that I couldnt find anywhere else. The prices are reasonable and the website is very easy to navigate. Highly recommended!',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Book Club Host',
    rating: 4,
    text: 'Great customer service! I had an issue with an order and they resolved it on WhatsApp within minutes. The book recommendations are also spot on.',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Teacher',
    rating: 5,
    text: 'I regularly order books for my classroom from Aura Reads. The packaging is always secure and the quality of books is top-notch.',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-16 lg:py-24 bg-white" id="customer-reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-accent-400 font-semibold text-sm uppercase tracking-wider mb-2">Testimonials</p>
          <h2 className="section-title">What Our Readers Say</h2>
          <p className="section-subtitle">Real reviews from our lovely community</p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-surface-50 rounded-2xl p-8 h-full border border-surface-200">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-accent-400 fill-accent-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-8 italic">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-primary-500">{review.name}</h4>
                    <p className="text-xs text-gray-400">{review.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;
