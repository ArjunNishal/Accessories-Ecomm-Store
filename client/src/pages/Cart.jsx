import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decQuantity, ADD, Removeitem } from "../redux/actions/action";
import { axiosInstance, renderUrl } from "../config";

const Cart = () => {
  const token = localStorage.getItem("token");
  const [price, setPrice] = useState(0);

  const getdata = useSelector((state) => state.cartReducer.carts);
  // console.log(getdata, "state cart page");

  const dispatch = useDispatch();

  // count total price of the cart
  const total = () => {
    let totalPrice = 0;
    getdata?.forEach((item) => {
      totalPrice += parseFloat(item.totalPrice);
    });
    setPrice(totalPrice);
  };

  useEffect(() => {
    total();
  }, [getdata]);

  // actions
  // decrease quantity of an item
  const dlt = (item) => {
    dispatch(decQuantity(item));
  };

  // increase quantity
  const send = (item) => {
    console.log("send", item);
    if (token) {
      const res = axiosInstance.post("cart/add", item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    dispatch(ADD(item));
  };
  //
  const RemoveItem = (id) => {
    // console.log(e);
    dispatch(Removeitem(id));
  };

  // getcharms
  const [charms, setCharms] = useState([]);

  useEffect(() => {
    fetchCharms();
  }, []);

  const fetchCharms = () => {
    axiosInstance
      .get("charm/getcharm")
      .then((response) => {
        setCharms(response.data);
        console.log(response.data, "charms");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getcharm = (id) => {
    const selected = charms.find((el) => el._id === id);
    console.log(selected, id);

    if (selected) {
      return selected.name;
    }

    return "Charm not found"; // Return an appropriate message if the charm with the given id is not found.
  };
  return (
    <div>
      <Header />
      {/* breadcrumb-area start */}
      <div className="cart breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="breadcrumb-title">Cart</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Cart</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}
      {/* main-content-wrap start */}

      <div className="main-content-wrap section-ptb cart-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {getdata && getdata.length > 0 ? (
                <>
                  <div className="cart-table ">
                    <div className="table-content table-responsive d-md-block d-none">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="plantmore-product-thumbnail">
                              Images
                            </th>
                            <th className="cart-product-name">Product</th>
                            <th className="plantmore-product-price">
                              Customizations
                            </th>
                            <th className="plantmore-product-quantity">
                              Quantity
                            </th>
                            <th className="plantmore-product-subtotal">
                              Total
                            </th>
                            <th className="plantmore-product-remove">Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getdata.map((item, index) => (
                            <tr className="cart-list-item" key={index}>
                              <td className="plantmore-product-thumbnail">
                                <Link to={`/productpage/${item.slug}`}>
                                  <img
                                    src={`${renderUrl}uploads/products/${item.images[0]}`}
                                    alt="productimg"
                                  />
                                </Link>
                              </td>
                              <td className="plantmore-product-name">
                                <Link to={`/productpage/${item.slug}`}>
                                  {item.name}
                                </Link>
                              </td>
                              <td className="plantmore-product-price text-start">
                                {item.nameOnProduct && (
                                  <p className="mb-0">
                                    <b>Name on product :</b>{" "}
                                    {item.nameOnProduct}
                                  </p>
                                )}
                                {item.nameOnProduct1 && (
                                  <p className="mb-0">
                                    <b>Name on product 1:</b>{" "}
                                    {item.nameOnProduct1}
                                  </p>
                                )}
                                {item.nameOnProduct2 && (
                                  <p className="mb-0">
                                    <b>Name on product 2:</b>{" "}
                                    {item.nameOnProduct2}
                                  </p>
                                )}
                                {item.selectedfont && (
                                  <p className="mb-0">
                                    <b> Font:</b> {item.selectedfont}
                                  </p>
                                )}
                                {item.selectedmodel && (
                                  <p className="mb-0">
                                    <b>Model:</b> {item.selectedmodel}
                                  </p>
                                )}
                                {item.giftWrap && (
                                  <p className="mb-0">Gift Wrap : Yes</p>
                                )}
                                {item.selectedCharm && (
                                  <p>
                                    <b> Charm : </b>
                                    {charms.find(
                                      (el) => el._id == item.selectedCharm
                                    )?.name || "Charm not found"}
                                  </p>
                                )}
                                {item.color && (
                                  <p>
                                    <b>Color :</b>{" "}
                                    <span
                                      style={{
                                        color: item.color.shade,
                                      }}
                                    >
                                      <i className="ion-record" />
                                    </span>
                                    &nbsp;{item.color.name}
                                  </p>
                                )}
                                {item.singleImage && (
                                  <>
                                    <p>
                                      <b>Selected Images :</b>
                                    </p>
                                    <img
                                      style={{
                                        width: "100px",
                                        maxHeight: "100px",
                                        objectFit: "contain",
                                      }}
                                      src={`${renderUrl}uploads/cartimages/${item.singleImage}`}
                                      alt={item.singleImage}
                                    />
                                  </>
                                )}
                                {item.multipleImage !== null &&
                                  item.multipleImage !== undefined &&
                                  item.multipleImage.length > 0 && (
                                    <>
                                      <p>
                                        <b>Selected Images :</b>
                                      </p>
                                      <div className="row">
                                        {item.multipleImage.map(
                                          (img, index) => (
                                            <img
                                              key={index}
                                              className="col-3 py-1"
                                              style={{
                                                maxHeight: "100px",
                                                objectFit: "contain",
                                              }}
                                              src={`${renderUrl}uploads/cartimages/${img}`}
                                              alt={img}
                                            />
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}
                                {/* <p
                                  className="single-line-ellipsis m-0"
                                  title={item.color}
                                >
                                  {item.color}
                                </p> */}
                              </td>

                              <td className="plantmore-product-quantity">
                                <div className="d-flex align-items-center justify-content-center">
                                  {item.productType !== "combo" && (
                                    <button
                                      onClick={() => dlt(item)}
                                      className="btn m-1"
                                    >
                                      -
                                    </button>
                                  )}
                                  <b className="border rounded">
                                    {item.quantity}
                                  </b>
                                  {item.productType !== "combo" && (
                                    <button
                                      onClick={() => {
                                        console.log("send");
                                        send(item);
                                      }}
                                      className="btn m-1"
                                    >
                                      +
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="product-subtotal">
                                <span className="amount">
                                  ₹{item.totalPrice}
                                </span>
                              </td>
                              <td className="plantmore-product-remove">
                                <Link
                                  onClick={() => {
                                    RemoveItem(item);
                                  }}
                                  to="#"
                                >
                                  <i className="ion-close" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-md-none d-block">
                      <div className="cart-table2">
                        <h4>Cart items</h4>
                        {getdata.map((item, index) => (
                          <div
                            key={index}
                            className="cart-products row border rounded p-2 my-2"
                          >
                            <div className="col-3">
                              <Link to={`/productpage/${item.slug}`}>
                                <img
                                  src={`${renderUrl}uploads/products/${item.images[0]}`}
                                  alt="productimg"
                                />
                              </Link>
                            </div>
                            <div className="col-9">
                              <h5>
                                {" "}
                                <Link to={`/productpage/${item.slug}`}>
                                  {item.name}
                                </Link>
                              </h5>

                              <p className="m-0">
                                <b>Total :</b> ₹{item.totalPrice}
                              </p>
                              <div className="about-us-contents d-flex col-12 justify-content-center align-items-center p-1">
                                <div className="about-us-btn col-12">
                                  <Link
                                    className="btn mt-0 col-12 p-1 "
                                    onClick={() => {
                                      RemoveItem(item);
                                    }}
                                    to="#"
                                  >
                                    Remove Item
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div>
                              <p>
                                <b>Customizations</b>
                              </p>
                              <div>
                                {item.nameOnProduct && (
                                  <p className="mb-0">
                                    Name on product : {item.nameOnProduct}
                                  </p>
                                )}
                                {item.nameOnProduct1 && (
                                  <p className="mb-0">
                                    Name on product 1: {item.nameOnProduct1}
                                  </p>
                                )}
                                {item.nameOnProduct2 && (
                                  <p className="mb-0">
                                    Name on product 2: {item.nameOnProduct2}
                                  </p>
                                )}
                                {item.selectedfont && (
                                  <p className="mb-0">
                                    Font: {item.selectedfont}
                                  </p>
                                )}
                                {item.selectedmodel && (
                                  <p className="mb-0">
                                    Model: {item.selectedmodel}
                                  </p>
                                )}
                                {item.giftWrap && (
                                  <p className="mb-0">Gift Wrap : Yes</p>
                                )}
                                {item.selectedCharm && (
                                  <p>
                                    Charm :{" "}
                                    {charms.find(
                                      (el) => el._id == item.selectedCharm
                                    )?.name || "Charm not found"}
                                  </p>
                                )}
                                {item.color && (
                                  <p>
                                    Color :{" "}
                                    <span
                                      style={{
                                        color: item.color.shade,
                                      }}
                                    >
                                      <i className="ion-record" />
                                    </span>
                                    &nbsp;{item.color.name}
                                  </p>
                                )}
                                {item.singleImage && (
                                  <>
                                    <p>
                                      <b>Selected Images :</b>
                                    </p>
                                    <img
                                      style={{
                                        width: "100px",
                                        maxHeight: "100px",
                                        objectFit: "contain",
                                      }}
                                      src={`${renderUrl}uploads/cartimages/${item.singleImage}`}
                                      alt={item.singleImage}
                                    />
                                  </>
                                )}
                                {item.multipleImage !== null &&
                                  item.multipleImage !== undefined &&
                                  item.multipleImage.length > 0 && (
                                    <>
                                      <p>
                                        <b>Selected Images :</b>
                                      </p>
                                      <div className="row">
                                        {item.multipleImage.map(
                                          (img, index) => (
                                            <img
                                              key={index}
                                              className="col-3 py-1"
                                              style={{
                                                maxHeight: "100px",
                                                objectFit: "contain",
                                              }}
                                              src={`${renderUrl}uploads/cartimages/${img}`}
                                              alt={img}
                                            />
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}
                              </div>
                              <div className="plantmore-product-quantity">
                                <div className="d-flex align-items-center justify-content-start">
                                  <b>Quantity</b>
                                  <button
                                    onClick={() => dlt(item)}
                                    className="btn m-1"
                                  >
                                    -
                                  </button>
                                  <b className="border rounded">
                                    {item.quantity}
                                  </b>
                                  <button
                                    onClick={() => {
                                      console.log("send");
                                      send(item);
                                    }}
                                    className="btn m-1"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="coupon-all">
                          <div className="coupon2">
                            {/* <input
                          className="submit btn"
                          name="update_cart"
                          defaultValue="Update cart"
                          type="submit"
                        /> */}
                            <Link
                              to="/collections/allproducts"
                              className="btn continue-btn"
                            >
                              Continue Shopping
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 ml-auto">
                        <div className="cart-page-total">
                          <h2>Cart total</h2>
                          <ul>
                            <li>
                              Total <span>₹{price}</span>
                            </li>
                            {/* <li>
                          Total <span>₹{discountedPrice}</span>
                        </li> */}
                          </ul>
                          {getdata.length > 0 && (
                            // <>
                            //   {token ? (
                            <Link
                              to="/checkout"
                              className="proceed-checkout-btn"
                            >
                              Proceed to checkout
                            </Link>
                            // ) : (
                            //   <>
                            //     <Link
                            //       to="/login-register"
                            //       className="proceed-checkout-btn"
                            //     >
                            //       Login
                            //     </Link>
                            //     <p className="text-danger">
                            //       *Please login before Checkout.*
                            //     </p>
                            //   </>
                            // )}
                            // </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-items">
                  <div>
                    <p className="text-center">NO items in your cart</p>
                  </div>
                  <div className="coupon2 d-flex justify-content-center mt-3">
                    {/* <input
                            className="submit btn"
                            name="update_cart"
                            defaultValue="Update cart"
                            type="submit"
                          /> */}
                    <Link
                      to="/collections/allproducts"
                      className="btn continue-btn"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* main-content-wrap end */}
      <Footer />
    </div>
  );
};

export default Cart;
