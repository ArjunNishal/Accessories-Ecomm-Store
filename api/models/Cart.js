const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        nameOnProduct: { type: String },
        mobilename: { type: String },
        nameOnProduct1: { type: String },
        nameOnProduct2: { type: String },
        selectedCharm: { type: String },
        selectedmodel: { type: String },
        selectedfont: { type: String },
        specialInstructions: { type: String },
        giftWrap: { type: Boolean },
        multipleImage: [{ type: String }],
        singleImage: { type: String },
        color: { name: { type: String }, shade: { type: String } },
        inputValues: {
          type: Object,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
