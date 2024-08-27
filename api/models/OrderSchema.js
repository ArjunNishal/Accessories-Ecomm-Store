const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    address: {
      address1: {
        type: String,
        required: true,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postcode: {
        type: String,
        required: true,
      },
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    orderNotes: {
      type: String,
    },
    items: {
      type: Array,
      required: true,
    },
    deliverydetails: {
      type: String,
    },
    ordertotal: {
      type: String,
      required: true,
    },
    orderstatus: {
      type: String,
      enum: [
        "order_placed",
        "packed",
        "confirmed",
        "out_for_delivery",
        "delivered",
      ],
      default: "order_placed",
    },
    paymentStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    appliedCoupon: {
      code: {
        type: String,
      },
      discountedPrice: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
