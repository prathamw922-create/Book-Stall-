const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabase');
const generateOrderNumber = require('../utils/generateOrderNumber');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  // Get user's cart
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', req.user._id).single();
  
  if (!cart) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('quantity, books(*)')
    .eq('cart_id', cart.id);

  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Build order items and calculate subtotal
  let subtotal = 0;
  const orderItems = [];

  for (const item of cartItems) {
    if (!item.books) {
      res.status(400);
      throw new Error('A book in your cart is no longer available');
    }

    if (item.books.stock < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for "${item.books.title}". Available: ${item.books.stock}`);
    }

    orderItems.push({
      book_id: item.books.id,
      title: item.books.title,
      author: item.books.author,
      price: item.books.price,
      quantity: item.quantity,
      image: item.books.image || '',
    });

    subtotal += item.books.price * item.quantity;
  }

  // Calculate delivery charge
  const deliveryCharge =
    subtotal >= (parseInt(process.env.FREE_DELIVERY_ABOVE) || 500)
      ? 0
      : parseInt(process.env.DELIVERY_CHARGE) || 50;

  const grandTotal = subtotal + deliveryCharge;

  // Generate unique order number
  let orderNumber;
  let isUnique = false;
  while (!isUnique) {
    orderNumber = generateOrderNumber();
    const { data: existing } = await supabase.from('orders').select('id').eq('order_number', orderNumber).single();
    if (!existing) isUnique = true;
  }

  // Create order
  const { data: order, error: orderError } = await supabase.from('orders').insert([{
    order_number: orderNumber,
    user_id: req.user._id,
    shipping_address: shippingAddress,
    payment_method: 'COD',
    subtotal,
    delivery_charge: deliveryCharge,
    grand_total: grandTotal,
    status: 'Pending',
    status_history: [{ status: 'Pending', changedAt: new Date().toISOString(), note: 'Order placed' }],
  }]).select().single();

  if (orderError) {
    res.status(500);
    throw new Error('Failed to create order');
  }

  // Create order items
  const itemsToInsert = orderItems.map(item => ({ ...item, order_id: order.id }));
  await supabase.from('order_items').insert(itemsToInsert);

  // Reduce stock
  for (const item of orderItems) {
    // using raw update to decrement stock, but for simplicity we fetch and decrement
    const { data: bookToUpdate } = await supabase.from('books').select('stock').eq('id', item.book_id).single();
    if (bookToUpdate) {
      await supabase.from('books').update({ stock: bookToUpdate.stock - item.quantity }).eq('id', item.book_id);
    }
  }

  // Clear cart
  await supabase.from('cart_items').delete().eq('cart_id', cart.id);

  res.status(201).json({ ...order, _id: order.id, items: orderItems.map(i => ({...i, book: i.book_id})) });
});

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const { data: orders } = await supabase.from('orders').select('*').eq('user_id', req.user._id).order('created_at', { ascending: false });
  res.json((orders || []).map(o => ({ ...o, _id: o.id })));
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const { data: order, error } = await supabase.from('orders').select('*, users(name, email)').eq('id', req.params.id).single();

  if (error || !order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only allow order owner or admin to view
  if (order.user_id !== req.user._id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);

  res.json({
    ...order,
    _id: order.id,
    user: { ...order.users, _id: order.user_id },
    items: (items || []).map(i => ({ ...i, book: i.book_id }))
  });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('orders').select('*, users(name, email)', { count: 'exact' });

  if (req.query.status) {
    query = query.eq('status', req.query.status);
  }

  const { data: orders, count } = await query.order('created_at', { ascending: false }).range(from, to);

  res.json({
    orders: (orders || []).map(o => ({ ...o, _id: o.id, user: { ...o.users, _id: o.user_id } })),
    page,
    pages: Math.ceil((count || 0) / limit),
    total: count || 0,
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const { data: order, error } = await supabase.from('orders').select('id, status_history').eq('id', req.params.id).single();

  if (error || !order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const status_history = order.status_history || [];
  status_history.push({
    status,
    changedAt: new Date().toISOString(),
    note: note || `Status changed to ${status}`,
  });

  const { data: updatedOrder } = await supabase
    .from('orders')
    .update({ status, status_history })
    .eq('id', req.params.id)
    .select()
    .single();

  res.json({ ...updatedOrder, _id: updatedOrder.id });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
