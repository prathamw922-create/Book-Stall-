const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Public routes (specific routes MUST come before /:id)
router.get('/featured', getFeaturedBooks);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/search', searchBooks);

router.route('/').get(getBooks).post(protect, admin, createBook);
router.route('/:id').get(getBookById).put(protect, admin, updateBook).delete(protect, admin, deleteBook);
router.get('/:id/related', getRelatedBooks);

module.exports = router;
