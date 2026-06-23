const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabase');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const { count: totalBooks } = await supabase.from('books').select('id', { count: 'exact', head: true });
  const { count: totalOrders } = await supabase.from('orders').select('id', { count: 'exact', head: true });
  const { count: totalCustomers } = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_admin', false);

  const { data: allOrders } = await supabase.from('orders').select('status, grand_total');
  
  let pendingOrders = 0, confirmedOrders = 0, packedOrders = 0, shippedOrders = 0, deliveredOrders = 0;
  let totalRevenue = 0, totalSales = 0;

  if (allOrders) {
    allOrders.forEach(order => {
      totalSales += order.grand_total;
      if (order.status === 'Pending') pendingOrders++;
      else if (order.status === 'Confirmed') confirmedOrders++;
      else if (order.status === 'Packed') packedOrders++;
      else if (order.status === 'Shipped') shippedOrders++;
      else if (order.status === 'Delivered') {
        deliveredOrders++;
        totalRevenue += order.grand_total;
      }
    });
  }

  // Recent orders
  const { data: recentOrdersData } = await supabase
    .from('orders')
    .select('*, users(name, email)')
    .order('created_at', { ascending: false })
    .limit(5);
    
  const recentOrders = (recentOrdersData || []).map(o => ({
    ...o,
    _id: o.id,
    user: { ...o.users, _id: o.user_id }
  }));

  // Low stock books
  const { data: lowStockBooksData } = await supabase
    .from('books')
    .select('*')
    .lte('stock', 5)
    .order('stock', { ascending: true })
    .limit(10);
    
  const lowStockBooks = (lowStockBooksData || []).map(b => ({ ...b, _id: b.id }));

  res.json({
    totalBooks: totalBooks || 0,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    totalRevenue,
    totalSales,
    pendingOrders,
    confirmedOrders,
    packedOrders,
    shippedOrders,
    deliveredOrders,
    recentOrders,
    lowStockBooks,
  });
});

// @desc    Get monthly sales chart data
// @route   GET /api/admin/sales-chart
// @access  Admin
const getSalesChart = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, grand_total')
    .gte('created_at', `${year}-01-01T00:00:00.000Z`)
    .lte('created_at', `${year}-12-31T23:59:59.999Z`);

  const monthlySales = {};
  if (orders) {
    orders.forEach(order => {
      const month = new Date(order.created_at).getMonth() + 1; // 1 to 12
      if (!monthlySales[month]) {
        monthlySales[month] = { totalSales: 0, totalOrders: 0 };
      }
      monthlySales[month].totalSales += order.grand_total;
      monthlySales[month].totalOrders += 1;
    });
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const chartData = months.map((month, index) => {
    const data = monthlySales[index + 1];
    return {
      month,
      sales: data ? data.totalSales : 0,
      orders: data ? data.totalOrders : 0,
    };
  });

  res.json(chartData);
});

module.exports = { getDashboardStats, getSalesChart };
