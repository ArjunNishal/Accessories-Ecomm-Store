const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticate = require("../Middlewares/auth");

router.post(
  "/addcategory",
  authenticate,
  categoryController.upload.single("image"),
  categoryController.addCategory
);

router.put(
  "/updatecategory/:id",
  authenticate,
  categoryController.upload.single("image"),
  categoryController.updateCategory
);

router.get("/view/categories", categoryController.getCategories);

// get products of selected category
router.get("/products/:category", categoryController.getProductsByCategory);

router.delete(
  "/remove/:categoryname",
  authenticate,
  categoryController.removecategory
);

module.exports = router;
