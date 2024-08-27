import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Userslist } from "../../components/Userstest";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { States } from "../../components/States";
import { axiosInstance, backendurl, stripeKey } from "../../config";
import { clearCartAndUser } from "../../redux/actions/action";
import Lottie from "lottie-react";
import Couponanimation from "../../components/Couponanimation.json";
import orderplaced from "../../components/orderplaced.json";
import placingorder from "../../components/placingorder.json";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { cashfree } from "./utils";

const CashfreeType = () => {
  const { oid } = useParams("");
  const getdata = useSelector((state) => state.cartReducer.carts);
  // console.log(getdata, "getdata");
  const token = localStorage.getItem("token");
  const [loggedinuser, setloggedinuser] = useState("");
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const loggedinuser = decoded.id;
      console.log(loggedinuser, decoded, "loggedinuser");
      setloggedinuser(loggedinuser);
    }
  }, []);

  // cashfree

  const handleCheckout3 = async () => {
    try {
      console.log("handleCheckout3 called");
      const getorder = await axiosInstance.post(
        `payment/initiate/cashfree`,
        { getdata, orderId: oid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(getorder.data, "getorder");

      if (getorder.data.status) {
        console.log(getorder.data.data);
        // setsessionId(getorder.data.payment_session_id);
        if (getorder.data.data.payment_session_id) {
          handleCashfreePayment(getorder.data.data.payment_session_id);
        }
        // window.location.href = `https://sandbox.cashfree.com/pgapp/payment/${getorder.data.payment_session_id}`;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const handleCashfreePayment = (sessionId) => {
    try {
      console.log("cashfreecheckoutpage fun called");
      if (sessionId) {
        // alert(sessionId);
        let checkoutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: "_self",
        };

        cashfree.checkout(checkoutOptions).then(function (result) {
          console.log(result);
          if (result.error) {
            alert(result.error.message);
            console.log(result.error);
          }
          if (result.redirect) {
            console.log("redirection");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {" "}
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
                  <Link
                    to={""}
                    onClick={handleCheckout3}
                    className="btn loginbtn"
                  >
                    Continue
                  </Link>
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

export default CashfreeType;
