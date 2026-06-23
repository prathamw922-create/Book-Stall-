const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabase');

// Generate unique ID for arrays
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to get user
const getUser = async (id) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, addresses, wishlist, recently_viewed')
    .eq('id', id)
    .single();
  if (error) throw new Error('User not found');
  return user;
};

// @desc    Add address
// @route   POST /api/users/address
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await getUser(req.user._id);
  const { fullName, phone, address, city, state, pincode, isDefault } = req.body;
  
  let addresses = user.addresses || [];

  if (isDefault) {
    addresses.forEach((addr) => (addr.isDefault = false));
  }

  const newAddress = { 
    _id: generateId(),
    fullName, phone, address, city, state, pincode, 
    isDefault: isDefault || addresses.length === 0 
  };
  
  addresses.push(newAddress);

  await supabase.from('users').update({ addresses }).eq('id', user.id);
  res.status(201).json(addresses);
});

// @desc    Update address
// @route   PUT /api/users/address/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await getUser(req.user._id);
  let addresses = user.addresses || [];
  
  const addressIndex = addresses.findIndex(addr => addr._id === req.params.id);

  if (addressIndex === -1) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (req.body.isDefault) {
    addresses.forEach((addr) => (addr.isDefault = false));
  }

  addresses[addressIndex] = { ...addresses[addressIndex], ...req.body };

  await supabase.from('users').update({ addresses }).eq('id', user.id);
  res.json(addresses);
});

// @desc    Delete address
// @route   DELETE /api/users/address/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await getUser(req.user._id);
  let addresses = user.addresses || [];
  
  addresses = addresses.filter((addr) => addr._id !== req.params.id);

  await supabase.from('users').update({ addresses }).eq('id', user.id);
  res.json(addresses);
});

// @desc    Toggle wishlist
// @route   POST /api/users/wishlist/:bookId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await getUser(req.user._id);
  const bookId = req.params.bookId;

  const { data: book } = await supabase.from('books').select('id').eq('id', bookId).single();
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  let wishlist = user.wishlist || [];
  const index = wishlist.indexOf(bookId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(bookId);
  }

  await supabase.from('users').update({ wishlist }).eq('id', user.id);

  // Return populated wishlist
  if (wishlist.length > 0) {
    const { data: populatedBooks } = await supabase.from('books').select('*').in('id', wishlist);
    res.json(populatedBooks || []);
  } else {
    res.json([]);
  }
});

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await getUser(req.user._id);
  const wishlist = user.wishlist || [];
  
  if (wishlist.length > 0) {
    const { data: populatedBooks } = await supabase.from('books').select('*').in('id', wishlist);
    res.json(populatedBooks || []);
  } else {
    res.json([]);
  }
});

// @desc    Add to recently viewed
// @route   POST /api/users/recently-viewed
// @access  Private
const addRecentlyViewed = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const user = await getUser(req.user._id);
  
  let recentlyViewed = user.recently_viewed || [];

  // Remove if already in list
  recentlyViewed = recentlyViewed.filter((item) => item.book !== bookId);

  // Add to beginning
  recentlyViewed.unshift({ book: bookId, viewedAt: new Date() });

  // Keep only last 20
  if (recentlyViewed.length > 20) {
    recentlyViewed = recentlyViewed.slice(0, 20);
  }

  await supabase.from('users').update({ recently_viewed: recentlyViewed }).eq('id', user.id);
  res.json({ message: 'Added to recently viewed' });
});

module.exports = {
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  getWishlist,
  addRecentlyViewed,
};
