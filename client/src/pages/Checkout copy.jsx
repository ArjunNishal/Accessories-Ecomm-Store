import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Userslist } from "../components/Userstest";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { States } from "../components/States";
import { axiosInstance } from "../config";
import { clearCartAndUser } from "../redux/actions/action";
import Lottie from "lottie-react";
import Couponanimation from "../components/Couponanimation.json";
import orderplaced from "../components/orderplaced.json";
import placingorder from "../components/placingorder.json";

const Checkout = () => {
  const getdata = useSelector((state) => state.cartReducer.carts);
  console.log(getdata, "getdata");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isCouponCodeValid, setIsCouponCodeValid] = useState(false);
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
      console.log(loggedinuser, decoded, "loggedinuser");
      setloggedinuser(loggedinuser);
    }
  }, []);
  // const users = Userslist;
  // const promocodes = users[0].promocode;
  // get all coupons
  const getAllCoupons = async () => {
    try {
      const response = await axiosInstance.get("coupon/getcoupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const coupons = response.data;
      console.log(coupons, "coupons");
      setpromocodes(coupons);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCoupons();
  }, []);
  const [promocodes, setpromocodes] = useState([]);

  // count total price of the cart
  const total = () => {
    let totalPrice = 0;
    getdata?.forEach((item) => {
      totalPrice += parseFloat(item.discount * item.quantity);
    });
    setPrice(totalPrice);
  };

  useEffect(() => {
    total();
  }, [getdata]);

  useEffect(() => {
    let grandTotal = parseFloat(price);
    if (isCouponCodeValid) {
      const discountAmount = (discount / 100) * price;
      setTotalDiscount(discountAmount);
      setDiscountedPrice((grandTotal - discountAmount).toFixed(2));
    } else {
      setDiscountedPrice(grandTotal);
    }
  }, [price, isCouponCodeValid, discount]);

  const checkPromoCode = (event) => {
    event.preventDefault();
    setappliedcoupon("");
    seterror("");
    const isPromoCodeValid = promocodes.find((el) => el.code === couponCode);
    if (isPromoCodeValid) {
      setIsCouponCodeValid(true);
      setDiscount(isPromoCodeValid.discount);
      setappliedcoupon(isPromoCodeValid.code);
      setShowCouponAnimation(true);
      setTimeout(() => {
        setShowCouponAnimation(false);
      }, animationDuration);
    } else {
      setappliedcoupon("Coupon not valid");
    }
  };
  const removeCouponCode = () => {
    // let grandTotal = parseFloat(price);
    // setDiscountedPrice(grandTotal.toFixed(3));
    setIsCouponCodeValid(false);
    setDiscount("");
    setappliedcoupon("");
    setCouponCode("");
  };

  useEffect(() => {
    console.log("remove", discount, isCouponCodeValid, appliedcoupon);
  }, [discount, isCouponCodeValid, appliedcoupon]);

  // accordian
  const [loginVisible, setLoginVisible] = useState(false);
  const [couponVisible, setCouponVisible] = useState(false);

  // order animations
  const [orderplace, setorderplace] = useState(false);
  const [orderplacing, setorderplacing] = useState(false);
  // =============================

  const toggleLogin = () => {
    setLoginVisible(!loginVisible);
  };

  const toggleCoupon = () => {
    setCouponVisible(!couponVisible);
  };

  // place order
  const dispatch = useDispatch();
  const navigate = useNavigate("");
  const [formData, setFormData] = useState({
    firstName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
    phone: "",
    email: "",
    orderNotes: "",
    items: getdata,
    ordertotal: "",
  });
  // console.log(formData, "formdata");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(value, name, "formdata checkout page");
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ordertotal: discountedPrice,
    }));
  }, [discountedPrice]);

  // place order and save order details  in the db
  const handleplaceorder = async (event) => {
    event.preventDefault();
    // console.log(" place order");
    try {
      // setorderplacing(true);
      const response = await axiosInstance.post("order/placeorder", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        // setorderplacing(false);
        // setorderplace(true);
        const data = response.data.orderid;
        console.log(response);
        handleCheckout(data);
        // setTimeout(() => {
        // setorderplace(false);
        // navigate(`/profile/${loggedinuser}`);
        // navigate("/payment");
        // }, 2000);
        // dispatch(clearCartAndUser());
      } else {
        throw new Error("Failed to place order");
        // setorderplacing(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      // setorderplacing(false);
      // Display error message to the user
    }
    // setorderplacing(false);
  };

  // payment gateway connection
  const handleCheckout = async (orderid) => {
    try {
      const response = await axiosInstance.post(
        "payment/gateway",
        { getdata, orderid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const session = response.data.session;
        console.log(response, session);
        window.location.replace(session.url);
      } else {
        console.error("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle form submission
  const checkerror = () => {
    if (
      !formData.firstName.trim() ||
      !formData.address1.trim() ||
      !formData.country.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.postcode.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      setErrorMessage("Please fill in all required fields.");
    } else {
      console.log("Form submitted successfully!");
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
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Checkout</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}
      {/* main-content-wrap start */}
      <div className="main-content-wrap section-ptb checkout-page">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="coupon-area">
                {/* coupon-accordion start */}
                {token ? (
                  ""
                ) : (
                  <div className="coupon-accordion">
                    <h3 onClick={toggleLogin}>
                      Returning customer?{" "}
                      <span className="coupon" id="showlogin">
                        Click here to login
                      </span>
                    </h3>
                    <div
                      className={`coupon-content ${loginVisible ? "open" : ""}`}
                      id="checkout-login"
                    >
                      <div className="coupon-info">
                        <p>
                          If you have shopped with us before, please enter your
                          details in the boxes below. If you are a new customer,
                          please proceed to the Billing &amp; Shipping section.
                        </p>
                        <form action="#">
                          <p className="coupon-input form-row-first">
                            <label>
                              Username or email{" "}
                              <span className="required">*</span>
                            </label>
                            <input type="text" name="email" />
                          </p>
                          <p className="coupon-input form-row-last">
                            <label>
                              password <span className="required">*</span>
                            </label>
                            <input
                              type="password"
                              autoComplete="off"
                              name="password"
                            />
                          </p>
                          <div className="clear" />
                          <p>
                            <button
                              type="submit"
                              className="button-login btn"
                              name="login"
                              value="Login"
                            >
                              Login
                            </button>
                            <label className="remember">
                              <input type="checkbox" defaultValue={1} />
                              <span>Remember</span>
                            </label>
                          </p>
                          <p className="lost-password">
                            <Link to="/forgotpassword">
                              Lost your password?
                            </Link>
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* coupon-accordion end */}
                {/* coupon-accordion start */}
                {token && (
                  <div className="coupon-accordion">
                    <h3 onClick={toggleCoupon}>
                      Have a coupon?{" "}
                      <span className="coupon" id="showcoupon">
                        Click here to enter your code
                      </span>
                    </h3>
                    <div
                      className={`coupon-content ${couponVisible ? "open" : ""
                        }`}
                      id="checkout-coupon"
                    >
                      <div className="coupon-info">
                        <form
                          onSubmit={checkPromoCode}
                          className="discount d-flex align-items-center gap-1 mb-3"
                        >
                          <div className="">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Coupon Code"
                              aria-label="Recipient's username"
                              aria-describedby="basic-addon2"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn button-apply-coupon"
                            name="apply_coupon"
                            value="Apply coupon"
                          >
                            Apply
                          </button>
                        </form>
                        {appliedcoupon && (
                          <>
                            {appliedcoupon !== "Coupon not valid" ? (
                              <div className="appliedcoupon d-flex justify-content-between align-items-center">
                                <b className="text-success">
                                  {appliedcoupon} Coupon applied
                                </b>
                                <i
                                  onClick={removeCouponCode}
                                  className="fa-solid fa-xmark"
                                ></i>
                              </div>
                            ) : (
                              <p className="text-danger">*{appliedcoupon}</p>
                            )}
                          </>
                        )}
                        {showCouponAnimation && (
                          <div className="coupon-animation-container">
                            <div
                              className="coupon-animation"
                            // style={{ height: "100px", width: "100px" }}
                            >
                              <Lottie
                                animationData={Couponanimation}
                                loop={true}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* coupon-accordion end */}
              </div>
            </div>
          </div>
          {/* order placed animation */}
          {orderplace && (
            <div className="coupon-animation-container">
              <div
                className="coupon-animation"
              // style={{ height: "100px", width: "100px" }}
              >
                <Lottie animationData={orderplaced} loop={true} />
              </div>
            </div>
          )}
          {orderplacing && (
            <div className="coupon-animation-container">
              <div
                className="coupon-animation"
                style={{ height: "400px", width: "400px" }}
              >
                <Lottie animationData={placingorder} loop={true} />
              </div>
            </div>
          )}
          {/* checkout-details-wrapper start */}
          <div className="checkout-details-wrapper">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                {/* billing-details-wrap start */}
                <div className="billing-details-wrap">
                  <form onSubmit={handleplaceorder}>
                    <h3 className="shoping-checkboxt-title">Billing Details</h3>
                    <div className="row">
                      <div className="col-lg-12">
                        <p className="single-form-row">
                          <label>
                            Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <p className="single-form-row">
                          <label>
                            Address <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Address line 1 "
                            name="address1"
                            value={formData.address1}
                            required
                            onChange={handleInputChange}
                          />
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <p className="single-form-row">
                          <input
                            type="text"
                            placeholder="Address line 2"
                            name="address2"
                            value={formData.address2}
                            onChange={handleInputChange}
                          />
                        </p>
                      </div>
                      <div className="col-lg-6">
                        <p className="single-form-row  mb-0 pb-0">
                          <label>
                            Town / City <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </p>
                      </div>
                      <div className="col-lg-6">
                        <p className="single-form-row mb-0 pb-0">
                          <label>
                            State<span className="required">*</span>
                          </label>
                          <div className="nice-select wide">
                            <select
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select State...</option>
                              {States.map((state) => (
                                <option key={state.id} value={state.name}>
                                  {state.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </p>
                      </div>
                      <div className="col-lg-6">
                        <div className="single-form-row">
                          <label>
                            Country <span className="required">*</span>
                          </label>
                          <div className="nice-select wide">
                            <select
                              name="country"
                              value={formData.country}
                              required
                              onChange={handleInputChange}
                            >
                              <option value="">Select Country...</option>
                              <option value="India">India</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <p className="single-form-row">
                          <label>
                            Postcode / ZIP <span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            name="postcode"
                            value={formData.postcode}
                            required
                            onChange={handleInputChange}
                          />
                        </p>
                      </div>
                      <div className="col-lg-6">
                        <p className="single-form-row">
                          <label>
                            Phone <span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            name="phone"
                            value={formData.phone}
                            required
                            onChange={handleInputChange}
                          />
                        </p>
                      </div>
                      <div className="col-lg-6">
                        <p className="single-form-row">
                          <label>
                            Email address <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            required
                            onChange={handleInputChange}
                          />
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <p className="single-form-row m-0">
                          <label>Order notes</label>
                          <textarea
                            placeholder="Notes about your order, e.g. special notes for delivery."
                            className="checkout-mess"
                            rows={2}
                            cols={5}
                            name="orderNotes"
                            value={formData.orderNotes}
                            onChange={handleInputChange}
                          />
                        </p>
                      </div>
                      {errorMessage && (
                        <p style={{ color: "red" }}>{errorMessage}</p>
                      )}
                      {/* <Link> */}
                      <div className="container mt-2">
                        <button
                          className="btn text-white btn-danger w-100"
                          type="submit"
                          onClick={checkerror}
                        >
                          Shop now
                        </button>
                      </div>
                      {/* </Link> */}
                    </div>
                  </form>
                </div>
                {/* billing-details-wrap end */}
              </div>
              <div className="col-lg-6 col-md-6">
                {/* your-order-wrapper start */}
                <div className="your-order-wrapper">
                  <h3 className="shoping-checkboxt-title">Your Order</h3>
                  {/* your-order-wrap start*/}
                  <div className="your-order-wrap">
                    {/* your-order-table start */}
                    <div className="your-order-table table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th className="product-name">Product</th>
                            <th className="product-total">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getdata.length > 0 ? (
                            <>
                              {getdata.map((item) => (
                                <tr className="cart_item" key={item.id}>
                                  <td className="product-name">
                                    {item.name}
                                    <strong className="product-quantity">
                                      × {item.quantity}
                                    </strong>
                                  </td>
                                  <td className="product-total">
                                    <span className="amount">
                                      ₹{item.totalPrice}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            ""
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="cart-subtotal">
                            <th>Cart Subtotal</th>
                            <td>
                              <span className="amount"> ₹{price}</span>
                            </td>
                          </tr>
                          <tr className="shipping">
                            <th>Shipping</th>
                            <td>Free</td>
                          </tr>
                          {Totaldiscount && (
                            <tr className="order-total">
                              <th>Discount</th>
                              <td>
                                <strong>
                                  <span className="amount">
                                    -₹{Totaldiscount}
                                  </span>
                                </strong>
                              </td>
                            </tr>
                          )}
                          <tr className="order-total">
                            <th>Order Total</th>
                            <td>
                              <strong>
                                <span className="amount">
                                  ₹{discountedPrice}
                                </span>
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    {/* your-order-table end */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* checkout-details-wrapper end */}
        </div>
      </div>
      {/* main-content-wrap end */}
      <Footer />
    </div>
  );
};

export default Checkout;
