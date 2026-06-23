const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabase');

// Helper to format book (remap category_id to category for frontend compatibility)
const formatBook = (book) => {
  if (!book) return null;
  const formatted = { 
    ...book, 
    _id: book.id, 
    isFeatured: book.is_featured, 
    isBestSeller: book.is_best_seller, 
    isNewArrival: book.is_new_arrival, 
    avgRating: book.avg_rating,
    images: [book.image]
  };
  if (book.categories) {
    formatted.category = { _id: book.categories.id, name: book.categories.name, slug: book.categories.name.toLowerCase() };
    delete formatted.categories;
  }
  return formatted;
};

// @desc    Get all books (paginated, filterable, sortable)
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('books').select('*, categories(id, name)', { count: 'exact' });

  // Category filter
  if (req.query.category) {
    query = query.eq('category_id', req.query.category);
  }

  // Price range filter
  if (req.query.minPrice) query = query.gte('price', Number(req.query.minPrice));
  if (req.query.maxPrice) query = query.lte('price', Number(req.query.maxPrice));

  // Stock filter
  if (req.query.inStock === 'true') {
    query = query.gt('stock', 0);
  }

  // Sort
  if (req.query.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (req.query.sort === 'price_desc') query = query.order('price', { ascending: false });
  else if (req.query.sort === 'newest') query = query.order('created_at', { ascending: false });
  else if (req.query.sort === 'rating') query = query.order('avg_rating', { ascending: false });
  else if (req.query.sort === 'name_asc') query = query.order('title', { ascending: true });
  else if (req.query.sort === 'name_desc') query = query.order('title', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: books, count, error } = await query.range(from, to);

  if (error) {
    res.status(500);
    throw new Error('Error fetching books');
  }

  res.json({
    books: books.map(formatBook),
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const { data: book, error } = await supabase
    .from('books')
    .select('*, categories(id, name)')
    .eq('id', req.params.id)
    .single();

  if (error || !book) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.json(formatBook(book));
});

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
const getFeaturedBooks = asyncHandler(async (req, res) => {
  const { data: books } = await supabase
    .from('books')
    .select('*, categories(id, name)')
    .eq('is_featured', true)
    .limit(10);
  res.json((books || []).map(formatBook));
});

// @desc    Get best sellers
// @route   GET /api/books/bestsellers
// @access  Public
const getBestSellers = asyncHandler(async (req, res) => {
  const { data: books } = await supabase
    .from('books')
    .select('*, categories(id, name)')
    .eq('is_best_seller', true)
    .limit(10);
  res.json((books || []).map(formatBook));
});

// @desc    Get new arrivals
// @route   GET /api/books/new-arrivals
// @access  Public
const getNewArrivals = asyncHandler(async (req, res) => {
  const { data: books } = await supabase
    .from('books')
    .select('*, categories(id, name)')
    .eq('is_new_arrival', true)
    .order('created_at', { ascending: false })
    .limit(10);
  res.json((books || []).map(formatBook));
});

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
const searchBooks = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const { data: books } = await supabase
    .from('books')
    .select('*, categories(id, name)')
    .or(`title.ilike.%${q}%,author.ilike.%${q}%`)
    .limit(20);

  res.json((books || []).map(formatBook));
});

// @desc    Get related books
// @route   GET /api/books/:id/related
// @access  Public
const getRelatedBooks = asyncHandler(async (req, res) => {
  const { data: book } = await supabase.from('books').select('category_id').eq('id', req.params.id).single();

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  const { data: relatedBooks } = await supabase
    .from('books')
    .select('*, categories(id, name)')
    .eq('category_id', book.category_id)
    .neq('id', req.params.id)
    .limit(6);

  res.json((relatedBooks || []).map(formatBook));
});

// @desc    Create a book (admin)
// @route   POST /api/books
// @access  Admin
const createBook = asyncHandler(async (req, res) => {
  // Map mongoose camelCase fields to snake_case if they exist in request body
  const payload = { ...req.body };
  if ('isFeatured' in payload) { payload.is_featured = payload.isFeatured; delete payload.isFeatured; }
  if ('isBestSeller' in payload) { payload.is_best_seller = payload.isBestSeller; delete payload.isBestSeller; }
  if ('isNewArrival' in payload) { payload.is_new_arrival = payload.isNewArrival; delete payload.isNewArrival; }
  if ('avgRating' in payload) { payload.avg_rating = payload.avgRating; delete payload.avgRating; }
  if ('category' in payload) { payload.category_id = payload.category; delete payload.category; }

  const { data: book, error } = await supabase.from('books').insert([payload]).select().single();
  if (error) { res.status(400); throw new Error(error.message); }
  res.status(201).json(formatBook(book));
});

// @desc    Update a book (admin)
// @route   PUT /api/books/:id
// @access  Admin
const updateBook = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if ('isFeatured' in payload) { payload.is_featured = payload.isFeatured; delete payload.isFeatured; }
  if ('isBestSeller' in payload) { payload.is_best_seller = payload.isBestSeller; delete payload.isBestSeller; }
  if ('isNewArrival' in payload) { payload.is_new_arrival = payload.isNewArrival; delete payload.isNewArrival; }
  if ('avgRating' in payload) { payload.avg_rating = payload.avgRating; delete payload.avgRating; }
  if ('category' in payload) { payload.category_id = payload.category; delete payload.category; }

  const { data: book, error } = await supabase.from('books').update(payload).eq('id', req.params.id).select().single();
  if (error || !book) { res.status(404); throw new Error('Book not found'); }
  res.json(formatBook(book));
});

// @desc    Delete a book (admin)
// @route   DELETE /api/books/:id
// @access  Admin
const deleteBook = asyncHandler(async (req, res) => {
  const { error } = await supabase.from('books').delete().eq('id', req.params.id);
  if (error) { res.status(404); throw new Error('Book not found'); }
  res.json({ message: 'Book removed' });
});

module.exports = {
  getBooks,
  getBookById,
  getFeaturedBooks,
  getBestSellers,
  getNewArrivals,
  searchBooks,
  getRelatedBooks,
  createBook,
  updateBook,
  deleteBook,
};
