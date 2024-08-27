const express = require("express");
const router = express.Router();
const addReviewController = require("../controllers/ReviewControllers");
const authenticate = require("../Middlewares/auth");

// Add a new review
router.post(
  "/addreview",
  authenticate,
  addReviewController.upload.array("images", 5),
  addReviewController.addReview
);

router.delete(
  "/removereview/:reviewId",
  authenticate,
  addReviewController.removeReview
);

router.get(
  "/products/:productId/reviews",
  addReviewController.getReviewsForProduct
);

module.exports = router;
