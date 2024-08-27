import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Userslist } from "../components/Userstest";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { States } from "../components/States";
import { axiosInstance, backendurl, stripeKey } from "../config";
import { clearCartAndUser } from "../redux/actions/action";
import Lottie from "lottie-react";
import Couponanimation from "../components/Couponanimation.json";
import orderplaced from "../components/orderplaced.json";
import placingorder from "../components/placingorder.json";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { cashfree } from "./cashfree/utils";
import Swal from "sweetalert2";

const PayementType = () => {
  const { oid } = useParams("");
  const getdata = useSelector((state) => state.cartReducer.carts);
  const navigate = useNavigate("");
  // console.log(getdata, "getdata");
  const [price, setPrice] = useState(0);
  const [orderDetails, setorderDetails] = useState(null);
  const [discount, setDiscount] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isCouponCodeValid, setIsCouponCodeValid] = useState(false);
  const [isDisbaled, setIsDisbaled] = useState(false);
  const [error, seterror] = useState("");
  const [appliedcoupon, setappliedcoupon] = useState("");
  const token = localStorage.getItem("token");
  const [loggedinuser, setloggedinuser] = useState("");
  const [showCouponAnimation, setShowCouponAnimation] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(1500);
  const [Totaldiscount, setTotalDiscount] = useState("");
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const loggedinuser = decoded.id;
      // console.log(loggedinuser, decoded, "loggedinuser");
      setloggedinuser(loggedinuser);
    }
  }, []);

  const getorderDetails = async () => {
    try {
      const response = await axiosInstance.post(
        `cart/get/order`,
        { oid: oid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setorderDetails(response.data);
        const details = response.data;
        if (details.paymentStatus === true) {
          Swal.fire({
            icon: "success",
            title: "Payment Done!",
            text: "Payment done already for this order",
          });
          navigate("/collections/allproducts");
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  useEffect(() => {
    getorderDetails();
  }, [oid]);

  //   stripe
  const handleCheckout = async () => {
    try {
      setIsDisbaled(true);
      const response = await axiosInstance.post(
        `payment/gateway/stripe`,
        { getdata, orderId: oid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const session = response.data;
        // console.log(response.data, "response.data.data ////");
        // console.log(
        //   response.data.data.data.payment_url,
        //   "response.data.data.payment ////"
        // );
        // console.log(response.data, "response.data ////");
        // // startpayment2(session);
        // // startpayment(session);
        // if (response.data.data.data.payment_url) {
        // &client_txn_id=${clientTxnId}&txn_date=${}
        // window.location.href = response.data.data.data.payment_url;
        window.location.href = response.data.session.url;
        setIsDisbaled(false);
        // }
      } else {
        setIsDisbaled(false);
        console.error("Failed to create checkout session.");
      }
    } catch (error) {
      setIsDisbaled(false);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      console.error("Error creating checkout session:", error);
    }
  };

  //   upi gateway
  const handleCheckout2 = async () => {
    try {
      setIsDisbaled(true);
      const response = await axiosInstance.post(
        `payment/gateway`,
        { getdata, orderId: oid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const session = response.data;
        // console.log(response, "response.data.data ////");
        // console.log(
        //   response.data.data.data.payment_url,
        //   "response.data.data.payment ////"
        // );
        // console.log(response.data, "response.data ////");
        // // startpayment2(session);
        // // startpayment(session);
        if (response.data.data.data.payment_url) {
          // console.log(response.data.data.data.payment_url);
          window.location.href = response.data.data.data.payment_url;
          setIsDisbaled(false);

          // window.location.href = response.data.session.url;
        }
      } else {
        setIsDisbaled(false);
        console.error("Failed to create checkout session.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      console.error("Error creating checkout session:", error);
      setIsDisbaled(false);
    }
  };

  // cashfree

  const handleCheckout3 = async () => {
    try {
      setIsDisbaled(true);
      // console.log("handleCheckout3 called");
      const getorder = await axiosInstance.post(
        `payment/initiate/cashfree`,
        { getdata, orderId: oid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(getorder.data, "getorder");

      if (getorder.data.status) {
        // console.log(getorder.data.data);
        // setsessionId(getorder.data.payment_session_id);
        if (getorder.data.data.payment_session_id) {
          handleCashfreePayment(getorder.data.data.payment_session_id);
        }
        setIsDisbaled(false);
        // window.location.href = `https://sandbox.cashfree.com/pgapp/payment/${getorder.data.payment_session_id}`;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      setIsDisbaled(false);
      console.error("Error creating checkout session:", error);
    }
  };

  const handleCashfreePayment = (sessionId) => {
    try {
      // console.log("cashfreecheckoutpage fun called");
      if (sessionId) {
        // alert(sessionId);
        let checkoutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: "_self",
        };

        cashfree.checkout(checkoutOptions).then(function (result) {
          // console.log(result);
          if (result.error) {
            alert(result.error.message);
            console.log(result.error);
          }
          if (result.redirect) {
            console.log("redirection");
          }
        });
        setIsDisbaled(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
      setIsDisbaled(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      {/* breadcrumb-area start */}
      <div className="cart breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="breadcrumb-title">Checkout</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link to="/checkout">Checkout</Link>
                </li>
                <li className="breadcrumb-item active">
                  Select Payment gateway
                </li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}
      <div className="main-content-wrap section-ptb checkout-page">
        <div className="container ">
          <div className="row justify-content-center">
            <div
              className="col-md-6 col-lg-4 col-12"
              //   onClick={() => handleGatewaySelection("stripe")}
            >
              <div className="card gateway_cards_int shadow border-0 justify-content-center">
                <div className="card-body text-center">
                  <h4 className="card-title card_font">
                    Pay using <b className="">Card</b>
                  </h4>
                  <div>
                    <span>Powered by</span>
                    <img
                      src="https://cdn.brandfolder.io/KGT2DTA4/at/8vbr8k4mr5xjwk4hxq4t9vs/Stripe_wordmark_-_blurple.svg"
                      className="logo_payment_stripe "
                      alt="Stripe Logo"
                    />
                  </div>
                  <button
                    disabled={isDisbaled}
                    onClick={handleCheckout}
                    className="btn loginbtn text-white"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-4 col-12"
              //   onClick={() => handleGatewaySelection("upi")}
            >
              <div className="card gateway_cards_int shadow border-0 justify-content-center">
                <div className="card-body text-center">
                  <h4 className="card-title card_font">
                    Pay using <b className="">UPI</b>
                  </h4>
                  <div className="d-flex justify-content-center align-items-center">
                    <span>Powered by </span>
                    <img
                      className="logo_payment  "
                      src="https://upigateway.com/images/logo/brand-sm.svg"
                      alt
                    />
                    <img
                      className="logo_payment"
                      src="https://upigateway.com/images/logo/upigate.svg"
                      alt
                    />
                  </div>
                  {/* <h5 className="card-title">UPI Gateway</h5> */}
                  <button
                    disabled={isDisbaled}
                    onClick={handleCheckout2}
                    className="btn loginbtn text-white"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
            <div
              className="col-md-6 col-lg-4 col-12"
              //   onClick={() => handleGatewaySelection("upi")}
            >
              <div className="card gateway_cards_int shadow border-0 justify-content-center">
                <div className="card-body text-center">
                  <h4 className="card-title card_font">
                    Pay using <b className="">Cashfree</b>
                  </h4>
                  <div className="d-flex justify-content-center align-items-center">
                    <span>Powered by </span>
                    <img
                      className="logo_payment  "
                      src="https://cashfreelogo.cashfree.com/website/NavFooter/Cashfree-Dark.svg"
                      alt
                    />
                  </div>
                  {/* <h5 className="card-title">UPI Gateway</h5> */}
                  <button
                    disabled={isDisbaled}
                    onClick={handleCheckout3}
                    className="btn loginbtn text-white"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PayementType;
