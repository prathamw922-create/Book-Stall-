import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import BookCard from '../components/books/BookCard';
import Spinner from '../components/ui/Spinner';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination & Meta
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Filters State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    filter: searchParams.get('filter') || '', // for new-arrivals, bestsellers
  });

  // Sync state when URL params change externally
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      filter: searchParams.get('filter') || '',
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
    }));
  }, [searchParams.get('filter'), searchParams.get('search'), searchParams.get('category')]);

  // Fetch Categories
  useEffect(() => {
    API.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Books whenever filters or page change
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError('');

        // Handle special filters first
        if (filters.filter === 'new-arrivals') {
          const { data } = await API.get('/books/new-arrivals');
          setBooks(data);
          setTotalBooks(data.length);
          setTotalPages(1);
          return;
        }

        if (filters.filter === 'bestsellers') {
          const { data } = await API.get('/books/bestsellers');
          setBooks(data);
          setTotalBooks(data.length);
          setTotalPages(1);
          return;
        }

        if (filters.search) {
          const { data } = await API.get(`/books/search?q=${filters.search}`);
          setBooks(data);
          setTotalBooks(data.length);
          setTotalPages(1);
          return;
        }

        // Normal Catalog Query
        const queryParams = new URLSearchParams({
          page,
          limit: 12,
          ...(filters.category && { category: filters.category }),
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.sort && { sort: filters.sort }),
        });

        const { data } = await API.get(`/books?${queryParams}`);
        setBooks(data.books);
        setTotalPages(data.pages);
        setTotalBooks(data.total);
      } catch (err) {
        setError('Failed to fetch books. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    window.scrollTo(0, 0);
  }, [filters, page]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, search: '', filter: '' }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', sort: 'newest', search: '', filter: '' });
    setPage(1);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-primary-500 mb-4">Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
          <button
            onClick={() => handleFilterChange('category', '')}
            className={`block w-full text-left text-sm py-1 ${
              !filters.category ? 'text-accent-400 font-semibold' : 'text-gray-500 hover:text-primary-500'
            }`}
          >
            All Books
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleFilterChange('category', cat._id)}
              className={`block w-full text-left text-sm py-1 ${
                filters.category === cat._id ? 'text-accent-400 font-semibold' : 'text-gray-500 hover:text-primary-500'
              }`}
            >
              {cat.name} <span className="text-gray-400 text-xs ml-1">({cat.bookCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-primary-500 mb-4">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Clear Button */}
      {(filters.category || filters.minPrice || filters.maxPrice || filters.search || filters.filter) && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 page-enter page-enter-active">
      {/* Header & Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-primary-500 mb-2">
          {filters.search 
            ? `Search Results for "${filters.search}"`
            : filters.filter === 'new-arrivals' 
            ? 'New Arrivals'
            : filters.filter === 'bestsellers'
            ? 'Best Sellers'
            : 'All Books'}
        </h1>
        <p className="text-gray-500 text-sm">Showing {books.length} of {totalBooks} books</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
            <FilterSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar (Mobile Filter Toggle & Sort) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-surface-200">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-surface-100 text-primary-500 rounded-lg font-medium"
            >
              <FiFilter /> Filters
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 shrink-0">Sort by:</span>
              <div className="relative w-full sm:w-48">
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full appearance-none bg-surface-50 border border-surface-200 text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Book Grid */}
          {loading ? (
            <div className="py-20"><Spinner size="lg" /></div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">{error}</div>
          ) : books.length === 0 ? (
            <div className="bg-white py-16 text-center rounded-2xl border border-surface-200 shadow-sm">
              <p className="text-gray-500 text-lg mb-4">No books found matching your criteria.</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-surface-200 disabled:opacity-50 hover:bg-surface-100 transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === i + 1
                            ? 'bg-primary-500 text-white'
                            : 'hover:bg-surface-100 text-gray-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border border-surface-200 disabled:opacity-50 hover:bg-surface-100 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[80vw] bg-white shadow-xl animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-surface-200">
              <h2 className="text-lg font-semibold text-primary-500">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-gray-500 hover:bg-surface-100 rounded-full">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto grow">
              <FilterSidebar />
            </div>
            <div className="p-4 border-t border-surface-200 bg-surface-50">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
