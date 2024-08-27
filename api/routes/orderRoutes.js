// routes/order.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderControllers");

router.post("/placeorder", orderController.createOrder);



router.get("/view/orders", orderController.getAllOrders);

router.get("/view/ordersuser/:id", orderController.getAllOrdersforuser);
router.put("/:orderId/updateStatus", orderController.packOrder);

router.put("/updatePaymentStatus/:id", orderController.updatePaymentStatus);

module.exports = router;
