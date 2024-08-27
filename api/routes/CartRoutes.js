const cartController = require("../controllers/CartControllers");
const express = require("express");
const router = express.Router();
const authenticate = require("../Middlewares/auth");
const orderController = require("../controllers/orderControllers");

router.get("/getcart/:id", authenticate, cartController.getCartItems);
router.post(
  "/uploadimage",
  cartController.upload.fields([
    { name: "singleImage", maxCount: 1 },
    { name: "multipleImage", maxCount: 100 },
  ]),
  cartController.uploadimage
);
router.post("/add", authenticate, cartController.addItemToCart);
router.post("/reduce", authenticate, cartController.reduceItemInCart);
router.post("/delete", authenticate, cartController.deleteItemFromCart);
router.post("/createcart", authenticate, cartController.createCart);
router.post("/update", authenticate, cartController.updatecart);
router.post("/contactus", authenticate, cartController.contactus);
router.post("/subscribe", authenticate, cartController.subscribe);

router.post("/get/order", orderController.getSingleOrder);

module.exports = router;
