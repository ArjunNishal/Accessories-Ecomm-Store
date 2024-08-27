const express = require("express");
const Order = require("../models/OrderSchema");
const router = express.Router();
require("dotenv").config();
const constants = require("../constants");

const stripe = require("stripe")("sk_glive_51NPirUSGPN3Ia4GzvVajMl3iVreKjfgfdBtZ6YIxTmXjqtEpr0h5xZBrSlAqIc4mNVvhg0yO5G89WK1o5tZcoU988vP00OuFV32Nl");
// const stripe = require("stripe")("sk_gtest_51NPirUSGPN3Ia4GggzonG7mYLT5S9wie851xXChWnOpJz4iHBNFhaqjRer9oAN9DOD3LtKSfr8HHyHzkc7sGde4Nae00IQHQBeJN");

router.post("/gateway", async (req, res) => {
  try {
    const { getdata, orderId } = req.body;
    console.log("req.params.orderId", orderId);
    // console.log("req.params.getdat", getdata);
    // const discountAmount = Order.findById(req.params.orderId).select('appliedCoupon');
    // console.log(type(req.params.orderId));
    // console.log(typeof(JSON.parse(orderId)));
    var db = JSON.stringify(orderId);
var orderid = JSON.parse(db);
    const discountAmt = await Order.findById(orderid).select('ordertotal');
    // console.log("discountAmount", discountAmt.appliedCoupon.discountedPrice);
    // const T = discountAmt.appliedCoupon.code;
    const TotalAmount = discountAmt.ordertotal;
    // console.log("discountAmount price", discountAmount.discountedPrice);
    // const TotalDiscount = discountAmount.
    // console.log(process.env.STRIPE_SECRET_KEY);
    // getdata.push({name:Coupon, price:Math.ceil(-CouponAmt), discount:Math.ceil(-CouponAmt), quantity:1});
    console.log("getdata", getdata);

    const mydata = [{name:"Total Amount", price:TotalAmount, quantity:1}]

    const lineItems = mydata.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

    console.log(lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${constants.frontUrl}order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${constants.frontUrl}cart`,
    });
    console.log(session, "session");
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error });
  }
});

// router.post("/gateway", async (req, res) => {
//   // const { items } = req.body;
//   const { items, orderId } = req.body;
//   console.log("req.params.orderId", orderId);
//   // console.log("req.params.getdat", getdata);
//   // const discountAmount = Order.findById(req.params.orderId).select('appliedCoupon');
//   // console.log(type(req.params.orderId));
//   // console.log(typeof(JSON.parse(orderId)));
//   var db = JSON.stringify(orderId);
// var orderid = JSON.parse(db);
//   const discountAmt = await Order.findById(orderid).select('ordertotal');
//   console.log("discountAmount", discountAmt);

//   try {
//     // Number(discountAmt.ordertotal)
//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 2000,
//       currency: "inr",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

module.exports = router;




// payment_method_types: ["card", "google_pay", "affirm", "afterpay_clearpay", "alipay", "au_becs_debit", "bacs_debit", "bancontact", "blik", "boleto", "cashapp", "customer_balance", "eps", "fpx", "giropay", "grabpay", "ideal", "klarna", "konbini", "link", "oxxo", "p24", "paynow", "paypal", "pix", "promptpay", "sepa_debit", "sofort", "us_bank_account", "wechat_pay", "zip"],



