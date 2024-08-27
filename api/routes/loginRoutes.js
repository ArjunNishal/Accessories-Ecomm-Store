const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const authenticate = require("../Middlewares/auth");
const orderController = require("../controllers/orderControllers");

router.post("/signup", loginController.registerUser);
router.post("/login", loginController.loginUser);
router.post("/admin-login", loginController.loginUser);

// forgot password
// send reset pass link to mail =================================================
router.post("/resetpassword", loginController.forgotpassword);

// reset passsword =================================================================
router.put("/resetpassword/:id/:token", loginController.resetpass);
// reset Profile =================================================================
router.put("/updateProfile", authenticate, loginController.updateprofile);

// place order without login
router.post("/placeorder2", orderController.createOrder);

router.put("/updatePaymentStatus/:id", orderController.updatePaymentStatus);

module.exports = router;
