const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/OrderSchema");
const constants = require("../constants");

const { Cashfree } = require("cashfree-pg");

router.post("/gateway", async (req, res) => {
  const { getdata, orderId } = req.body;
  console.log(req.body);
  var db = JSON.stringify(orderId);
  var orderid = JSON.parse(db);
  const discountAmt = await Order.findById(orderid).populate("user");
  console.log(discountAmt, orderid);

  const amount = discountAmt.ordertotal;
  const currency = "INR";

  const accessCode = "AVYP16KI36CC98PYCC";
  const merchantId = "2786832";
  const encryptionKey = "A6452BC29B9EED2575538AEECFC591C1";
  const order_id = discountAmt._id.toString();
  const redirect_url = `${constants.frontUrl}order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order_id}`;
  const cancel_url = `${constants.frontUrl}cart`;
  const language = "eng";

  console.log(
    typeof amount,
    amount,
    "amount is this =================================="
  );
  try {
    var clientTxnId =
      new Date().getTime().toString() + Math.floor(Math.random() * 1000);
    console.log(
      typeof discountAmt.mobileno,
      discountAmt.mobileno,
      "=== mobileno ||"
    );
    console.log(clientTxnId);
    // http://localhost:3000/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=65c384cdf10ebc9d25024230&gateway=upigateway&client_txn_id=1707312531564399?client_txn_id=1707312531564399&txn_id=73077322
    const redirecturl = `https://customizehere.in/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&gateway=upigateway&client_txn_id=${clientTxnId}`;

    // const redirecturl = `https://www.google.com?&order_id=${orderId}&gateway=upigateway&client_txn_id=${clientTxnId}`;
    console.log(
      typeof redirecturl,
      redirecturl,
      "redirecturl ==================="
    );
    var data = JSON.stringify({
      key: "4c705bc6-cdbc-4963-88ab-93f0c1bfb79f",
      client_txn_id: clientTxnId,
      amount: amount,
      p_info: "Product Name",
      customer_name: discountAmt?.user?.username
        ? discountAmt.user.username
        : discountAmt.firstName,
      customer_email: discountAmt.email,
      customer_mobile: discountAmt.phone,
      redirect_url: redirecturl,
      udf1: "user defined field 1",
      udf2: "user defined field 2",
      udf3: "user defined field 3",
    });
    console.log(data, "data");

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.ekqr.in/api/create_order",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let responsepay = {};

    axios(config)
      .then(function (response) {
        console.log(response);
        console.log(JSON.stringify(response.data), "response========");
        // console.log(response, "payment");
        responsepay = response.data;

        res.status(200).json({
          status: true,
          data: response.data,
        });
      })
      .catch(function (error) {
        console.log(error, "error in payment");
      });

    console.log(responsepay, "responsepay");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment request failed" });
  }
});

// stripe
// const stripe = require("stripe")(
//   "sk_li_51NPirUSGPN3Ia4GzvVajMl3iVreKjdBtZ6YgIxTmXjqtEpr0h5xZBrSlAqIc4mNVvhg0yO5G89WK1o5tZcoU988vP00OuFV32Nl"
// );
const stripe = require("stripe")(
  "sk_li_51NPirUSGPN3Ia4GzvVajMl3iVreKjdBtZ6YIxTmXjqtddEpr0h5xZBrSlAqIc4mNVvhg0yO5G89WK1o5tZcoU988vP00OuFV32Nl"
);

router.post("/gateway/stripe", async (req, res) => {
  try {
    const { getdata, orderId } = req.body;
    console.log("req.params.orderId", orderId);

    var db = JSON.stringify(orderId);
    var orderid = JSON.parse(db);
    const discountAmt = await Order.findById(orderid).select("ordertotal");

    const TotalAmount = discountAmt.ordertotal;

    console.log("getdata", getdata);

    const mydata = [{ name: "Total Amount", price: TotalAmount, quantity: 1 }];

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
      success_url: `${constants.frontUrl}order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&gateway=stripe`,
      cancel_url: `${constants.frontUrl}cart`,
    });
    console.log(session, "session");
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error });
  }
});

router.post("/paymentstatus/upi", async (req, res) => {
  try {
    const { client_txn_id } = req.body;
    var axios = require("axios");

    // Get today's date and format it as DD-MM-YYYY
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();

    var formattedDate = dd + "-" + mm + "-" + yyyy;
    console.log(formattedDate, dd, mm, yyyy, client_txn_id);

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.ekqr.in/api/check_order_status",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        key: "4c705bc6-cdbc-4963-88ab-93f0c1bfb79f",
        client_txn_id: client_txn_id,
        txn_date: formattedDate,
      }),
    };

    // Function to make the API request
    const makeRequest = async () => {
      try {
        const response = await axios(config);
        console.log(config);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    // Make the initial request for today's date
    const response = await makeRequest(config);

    console.log(response, "first response");

    // If transaction not found for today, check for the previous day
    if (response.status === false) {
      console.log("started");
      // Adjust the date to the previous day
      today.setDate(today.getDate() - 1);
      var ddPrev = String(today.getDate()).padStart(2, "0");
      var mmPrev = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      var yyyyPrev = today.getFullYear();
      var formattedDatePrev = ddPrev + "-" + mmPrev + "-" + yyyyPrev;

      // Make the request for the previous day
      config.data = JSON.stringify({
        key: "4c705bc6-cdbc-4963-88ab-93f0c1bfb79f",
        client_txn_id: client_txn_id,
        txn_date: formattedDatePrev,
      });
      const responsePrevDay = await makeRequest();

      // Respond with the result of the previous day's request
      res.status(200).json(responsePrevDay);
    } else {
      // Respond with the result of today's request
      res.status(200).json(response);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/initiate/cashfree", async (req, res) => {
  try {
    const { getdata, orderId } = req.body;
    const Orderdetails = await Order.findById(orderId).populate("user");

    console.log(Orderdetails, orderId, "Order details fetched");

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": `${process.env.CASHFREE_APP_ID}`,
      "x-client-secret": `${process.env.CASHFREE_SECRET_KEY}`,
    };

    console.log(headers, "Headers");

    var clientTxnId =
      new Date().getTime().toString() + Math.floor(Math.random() * 1000);

    const redirecturl = `${constants.frontUrl}order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${Orderdetails._id}&gateway=cashfree&cashfreeorderid=${clientTxnId}`;
    const payload = {
      order_id: clientTxnId,
      order_amount: Orderdetails.ordertotal,
      customer_details: {
        customer_id: Orderdetails._id,
        customer_name: Orderdetails.firstName, // Ensure you are fetching correct details
        customer_email: Orderdetails.email,
        customer_phone: Orderdetails.phone,
      },
      order_currency: "INR",
      order_meta: {
        return_url: redirecturl,
      },
    };

    console.log(payload, "Payload");

    // Cashfree.XClientId = process.env.CASHFREE_APP_ID;
    // Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
    // Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

    // console.log(
    //   "==========================",
    //   Cashfree.XClientId,
    //   Cashfree.XClientSecret,
    //   Cashfree.XEnvironment,
    //   "Cashfree id ================="
    // );

    // test hook -> 2023-08-01

    // Cashfree.PGCreateOrder("2023-08-01", payload)
    //   .then((response) => {
    //     console.log("Order Created successfully:", response.data);

    //     return res.status(200).send({
    //       status: true,
    //       message: "order created",
    //       data: response.data,
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error.response.data.message);
    //     console.log(error.config.url);
    //     return res
    //       .status(500)
    //       .send({ status: false, message: "failed", error });
    //   });

    const url =
      process.env.CASHFREE_ENV === "api"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    axios
      .post(url, payload, { headers })
      .then((response) => {
        console.log("Order Created successfully:", response.data);

        return res.status(200).send({
          status: true,
          message: "order created",
          data: response.data,
        });
      })
      .catch((error) => {
        // console.error(
        //   "Error Response Data:",
        //   error.response ? error.response.data : error.message
        // );
        // console.error(
        //   "Error Config URL:",
        //   error.config ? error.config.url : "No URL"
        // );
        // console.error(
        //   "Error Headers:",
        //   error.config ? error.config.headers : "No Headers"
        // );
        // console.error(
        //   "Error Payload:",
        //   error.config ? error.config.data : "No Data"
        // );
        console.log(error);

        return res
          .status(500)
          .send({ status: false, message: "failed", error });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "failed", error });
  }
});

router.post("/cashfree/status/:orderid", async (req, res) => {
  try {
    const { orderid } = req.params;

    const options = {
      method: "GET",
      url: `https://${process.env.CASHFREE_ENV}.cashfree.com/pg/orders/${orderid}`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": `${process.env.CASHFREE_APP_ID}`,
        "x-client-secret": `${process.env.CASHFREE_SECRET_KEY}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        return res.status(200).send({
          status: true,
          message: "order fetched",
          data: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
        return res.status(200).send({
          status: false,
          message: "failed",
          error,
        });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "failed", error });
  }
});

module.exports = router;
