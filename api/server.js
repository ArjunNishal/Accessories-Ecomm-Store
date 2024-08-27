const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const ccav = require("./ccavutil.js");
const qs = require("querystring");
const fs = require("fs");
var http = require("http");
const app = express();
const Loginroutes = require("./routes/loginRoutes");
const Productroutes = require("./routes/productsRoutes");
const Categoryroutes = require("./routes/categoryRoutes");
const favitemroutes = require("./routes/FavitemRoutes");
const reviewroutes = require("./routes/ReviewRoutes");
const offerroutes = require("./routes/OfferRoutes");
const couponroutes = require("./routes/couponsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const CartRoutes = require("./routes/CartRoutes");
const CharmRoutes = require("./routes/charmRoutes");
const PenModelRoutes = require("./routes/penModelRoutes");
const OrderRoutes = require("./routes/orderRoutes");
const Payment = require("./routes/PaymentCC");
// const Payment = require("./routes/paymentRoutes copy");
const constants = require("./constants");

const ccavReqHandler = require("./ccavRequestHandler.js");
const ccavResHandler = require("./ccavResponseHandler.js");

const authenticate = require("./Middlewares/auth");
const path = require("path");

require("dotenv").config();
console.log("Prpoxy", constants.proxyUrl);
app.use(cors({ credentials: true, origin: constants.proxyUrl }));
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", constants.proxyUrl);
// });
// Access-Control-Allow-Origin: http://siteA.com
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("./uploads"));

// ============= cc avenue =========================================================
app.use(express.static("public"));
app.set("views", __dirname + "/public");
app.engine("html", require("ejs").renderFile);

app.get("/about", function (req, res) {
  res.render("dataFrom.html");
});

app.post("/ccavRequestHandler", function (request, response) {
  ccavReqHandler.postReq(request, response);
});

app.post("/ccavResponseHandler", function (request, response) {
  ccavResHandler.postRes(request, response);
});

// ============= cc avenue =========================================================

// Add headers before the routes are defined

// ROUTES
app.use("/api/user", Loginroutes);
app.use("/api/product", Productroutes);
app.use("/api/category", Categoryroutes);
app.use("/api/favitem", authenticate, favitemroutes);
app.use("/api/review", reviewroutes);
app.use("/api/offer", offerroutes);
app.use("/api/coupon", couponroutes);
app.use("/api/admin", authenticate, adminRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/charm", CharmRoutes);
app.use("/api/model", PenModelRoutes);
app.use("/api/order", authenticate, OrderRoutes);
app.use("/api/payment", Payment);

// app.use("/api/payment", Payment);

__dirname = path.resolve();
// app.use("/uploads",express.static(path.join(__dirname, "/uploads")));
app.use(express.static(path.join(__dirname, "./build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to mongo"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
