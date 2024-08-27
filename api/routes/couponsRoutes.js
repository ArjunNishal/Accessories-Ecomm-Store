const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponsController');

// Route for adding a new coupon
router.post('/addcoupon', couponController.addCoupon);

// Route for deleting a coupon by ID
router.delete('/deletecoupon/:couponId', couponController.deleteCoupon);

// Route for getting all coupons
router.get('/getcoupons', couponController.getAllCoupons);

module.exports = router;