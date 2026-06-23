import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { FiBookOpen, FiBook, FiFeather, FiGlobe, FiCpu, FiHeart, FiStar, FiMusic } from 'react-icons/fi';
import Spinner from '../ui/Spinner';

const iconMap = {
  'Fiction': FiBookOpen,
  'Non-Fiction': FiBook,
  'Poetry': FiFeather,
  'History': FiGlobe,
  'Science': FiCpu,
  'Romance': FiHeart,
  'Self-Help': FiStar,
  'Arts': FiMusic,
};

const colorPairs = [
  { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
  { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'hover:bg-emerald-100' },
  { bg: 'bg-amber-50', text: 'text-amber-600', hover: 'hover:bg-amber-100' },
  { bg: 'bg-rose-50', text: 'text-rose-600', hover: 'hover:bg-rose-100' },
  { bg: 'bg-cyan-50', text: 'text-cyan-600', hover: 'hover:bg-cyan-100' },
  { bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'hover:bg-indigo-100' },
  { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (categories.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 bg-linear-to-b from-surface-50 to-surface-100 relative overflow-hidden" id="categories">
      <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <p className="text-accent-500 font-bold text-sm uppercase tracking-widest mb-3">Browse by Genre</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-500 font-display mb-4">Popular Categories</h2>
          <div className="w-24 h-1 bg-linear-to-r from-accent-400 to-accent-300 mx-auto rounded-full mb-6" />
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Explore our wide range of categories to find your next favorite book.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, index) => {
            const color = colorPairs[index % colorPairs.length];
            const Icon = iconMap[cat.name] || FiBookOpen;

            return (
              <Link
                key={cat._id}
                to={`/books?category=${cat._id}`}
                className={`${color.bg} ${color.hover} rounded-xl p-6 text-center group transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className={`w-14 h-14 ${color.bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${color.text}`} />
                </div>
                <h3 className={`font-semibold ${color.text} text-sm`}>{cat.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{cat.bookCount || 0} books</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
