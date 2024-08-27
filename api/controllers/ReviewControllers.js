const Review = require("../models/reviewSchema");
const Product = require("../models/productSchema");
const multer = require("multer");
const fs = require("fs");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/reviews/");
  },
  filename: function (req, file, cb) {
    const currentDateTime = Date.now();
    const originalName = file.originalname.split(".")[0];
    const extension = file.originalname.split(".").pop();
    const uniqueFilename = `${originalName}_${currentDateTime}.${extension}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

const addReview = async (req, res) => {
  const { product, reviewer, reviewTitle, reviewText, rating } = req.body;

  try {
    // Get the filename of the uploaded image
    const imageFiles = req.files.map((file) => file.filename);

    const newReview = new Review({
      product,
      reviewer,
      reviewTitle,
      reviewText,
      rating,
      images: imageFiles,
    });

    const savedReview = await newReview.save();

    // add review in the product
    await Product.findByIdAndUpdate(
      product,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );

    return res.status(200).send({
      message: "New review added successfully",
      data: savedReview,
    });
  } catch (error) {
    return res.status(500).send({ message: "Failed to add new review" });
  }
};

const removeReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  try {
    // Find the review by its ID
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).send("Review not found");
    }

    // Delete the review images from the storage
    for (const image of review.images) {
      fs.unlinkSync(`uploads/reviews/${image}`);
    }

    // Remove the review from the product's reviews array
    console.log(review.product, "review.product");
    const updatedproduct = await Product.findByIdAndUpdate(
      review.product,
      { $pull: { reviews: reviewId } },
      { new: true }
    );

    // Delete the review from the database
    const removedreview = await Review.findByIdAndRemove(reviewId);

    return res.status(200).send({
      message: "Review deleted successfully",
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Failed to delete review" });
  }
};

// get reviews for a product
const getReviewsForProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    // console.log(productId,"id")
    const reviewsid = await Product.findOne({ slug: productId })
    // console.log(reviewsid,"id")

    const reviews = await Review.find({ product: reviewsid._id })
      .populate("product", "name") 
      .populate("reviewer", "username"); 

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

module.exports = { addReview, upload, removeReview, getReviewsForProduct };
