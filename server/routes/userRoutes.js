const express = require('express');
const router = express.Router();
const {
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  getWishlist,
  addRecentlyViewed,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/address', protect, addAddress);
router.put('/address/:id', protect, updateAddress);
router.delete('/address/:id', protect, deleteAddress);
router.post('/wishlist/:bookId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);
router.post('/recently-viewed', protect, addRecentlyViewed);

module.exports = router;
