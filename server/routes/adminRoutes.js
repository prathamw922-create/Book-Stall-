const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesChart } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/sales-chart', protect, admin, getSalesChart);

module.exports = router;
