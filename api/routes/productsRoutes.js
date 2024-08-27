const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");
const authenticate = require("../Middlewares/auth");
// add product
router.post(
  "/addproduct",
  authenticate,
  productController.upload.array("images", 10),
  productController.addProduct
);

// update product
router.put(
  "/updateproduct/:productId",
  authenticate,
  productController.upload.array("images", 10),
  productController.updateProduct
);

// DELETE a product
router.delete(
  "/deleteproduct/:productId",
  authenticate,
  productController.deleteProduct
);

// Get all products
router.get("/products", productController.getAllProducts);

// get single product
router.get("/products/:name", productController.getSingleProduct);

// Route to add a product to the highlighted list
router.put(
  "/highlighted/:productId",
  authenticate,
  productController.highlight
);

// Route to remove a product from the highlighted list
router.put(
  "/removehighlight/:productId",
  authenticate,
  productController.removehighlight
);

// get highlighted products
router.get("/highlighted", productController.gethighlighted);

router.delete(
  "/deleteimg/:imageName/:productid",
  authenticate,
  productController.deleteimg
);
// search
router.get('/search', productController.searchProducts);
module.exports = router;
