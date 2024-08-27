const express = require("express");
const Order = require("../models/OrderSchema");
const router = express.Router();
require("dotenv").config();
const constants = require("../constants");
var http = require('http'),
  fs = require('fs'),
  ccav = require('./ccavutil.js'),
  qs = require('querystring');

const stripe = require("stripe")("sk_lgive_51NPirUSGPN3Igga4GzvVajMl3iVreKjdBtZ6YIxTmXjqtEpr0h5xZBrSlAqIc4mNVvhg0yO5G89WK1o5tZcoU988vP00OuFV32Nl");
// const stripe = require("stripe")("sk_gtest_51NPirUSggGPN3Ia4GzonG7mYLT5S9wie851xXChWnOpJz4iHBNFhaqjRer9oAN9DOD3LtKSfr8HHyHzkc7sGde4Nae00IQHQBeJN");

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

    const mydata = [{ name: "Total Amount", price: TotalAmount, quantity: 1 }]
    const datan = [{
      merchant_id: "2786832",
      order_id: orderid,
      currency: "INR",
      amount: TotalAmount,
      redirect_url: "",
      cancel_url: "", 
      language: "EN"      
    }]


    var body = '',
      workingKey = 'A6452BC29B9EED2575538AEECFC59fg1C1',	//Put in the 32-Bit key shared by CCAvenues.
      accessCode = 'AVYP16KI36CC98PYCCgfg',			//Put in the Access Code shared by CCAvenues.
      encRequest = '',
      formbody = '';

    req.on('data', function (data) {
      body += datan;
      encRequest = ccav.encrypt(body, workingKey);
      formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
    });

    req.on('end', function () {
      res.writeHeader(200, { "Content-Type": "text/html" });
      res.write(formbody);
      res.end();
    })


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