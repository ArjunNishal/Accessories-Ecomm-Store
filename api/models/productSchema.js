const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: "0",
    },
    availability: {
      type: String,
      enum: ["instock", "outofstock"],
      default: "instock",
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: false,
      default: null,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: false,
        default: "no reviews for this product",
      },
    ],
    options: {
      options: [],
      products: [],
    },
    productType: {
      type: String,
      required: false,
      default: "Single",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
   
    colors: [
      {
        name: {
          type: String,
          required: true,
        },
        shade: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
