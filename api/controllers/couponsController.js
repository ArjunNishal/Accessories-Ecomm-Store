const Coupon = require('../models/couponsSchema');

// Controller for adding a new coupon
const addCoupon = async (req, res) => {
  try {
    const { code, discount } = req.body;

    const newCoupon = new Coupon({
      code,
      discount,
    });

    const savedCoupon = await newCoupon.save();

    res.status(200).send({
      message: 'Coupon added successfully',
      data: savedCoupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to add coupon' });
  }
};

// Controller for deleting a coupon by ID
const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.couponId;

    const deletedCoupon = await Coupon.findByIdAndRemove(couponId);

    if (!deletedCoupon) {
      return res.status(404).send('Coupon not found');
    }

    res.status(200).send({
      message: 'Coupon deleted successfully',
      data: deletedCoupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete coupon' });
  }
};

// Controller for getting all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.status(200).send(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch coupons' });
  }
};

module.exports = {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
};
