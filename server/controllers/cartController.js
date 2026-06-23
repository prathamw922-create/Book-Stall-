const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabase');

// Helper to fetch and format cart
const getFormattedCart = async (userId) => {
  const { data: cart } = await supabase.from('carts').select('id, user_id').eq('user_id', userId).single();
  if (!cart) return { items: [], user: userId };

  const { data: items } = await supabase
    .from('cart_items')
    .select('quantity, books(id, title, author, price, image, stock)')
    .eq('cart_id', cart.id);

  const formattedItems = (items || []).map(item => ({
    quantity: item.quantity,
    book: item.books ? {
      _id: item.books.id,
      title: item.books.title,
      author: item.books.author,
      price: item.books.price,
      image: item.books.image,
      stock: item.books.stock
    } : null
  })).filter(i => i.book !== null);

  return { _id: cart.id, user: cart.user_id, items: formattedItems };
};

// Helper to ensure cart exists
const ensureCart = async (userId) => {
  let { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).single();
  if (!cart) {
    const { data: newCart } = await supabase.from('carts').insert([{ user_id: userId }]).select('id').single();
    cart = newCart;
  }
  return cart;
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await getFormattedCart(req.user._id);
  res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { bookId, quantity = 1 } = req.body;

  const { data: book } = await supabase.from('books').select('stock').eq('id', bookId).single();
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (book.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  const cart = await ensureCart(req.user._id);

  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('book_id', bookId)
    .single();

  if (existingItem) {
    let newQuantity = existingItem.quantity + quantity;
    if (newQuantity > book.stock) newQuantity = book.stock;
    await supabase.from('cart_items').update({ quantity: newQuantity }).eq('id', existingItem.id);
  } else {
    await supabase.from('cart_items').insert([{ cart_id: cart.id, book_id: bookId, quantity }]);
  }

  res.json(await getFormattedCart(req.user._id));
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { bookId, quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const { data: book } = await supabase.from('books').select('stock').eq('id', bookId).single();
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (quantity > book.stock) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  const cart = await ensureCart(req.user._id);

  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id')
    .eq('cart_id', cart.id)
    .eq('book_id', bookId)
    .single();

  if (!existingItem) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  await supabase.from('cart_items').update({ quantity }).eq('id', existingItem.id);

  res.json(await getFormattedCart(req.user._id));
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:bookId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', req.user._id).single();
  
  if (cart) {
    await supabase.from('cart_items').delete().eq('cart_id', cart.id).eq('book_id', req.params.bookId);
  }

  res.json(await getFormattedCart(req.user._id));
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', req.user._id).single();
  if (cart) {
    await supabase.from('cart_items').delete().eq('cart_id', cart.id);
  }
  res.json({ message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
