import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  decQuantity,
  ADD,
  Removeitem,
  clearCartAndUser,
} from "../redux/actions/action";
import jwtDecode from "jwt-decode";
import { axiosInstance, renderUrl } from "../config";

const Navigation = ({ toggleMenu, opensearch }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [loggedinuser, setloggedinuser] = useState("");
  const gettoken = () => {
    const Token = localStorage.getItem("token");
    if (!token) {
      return;
    } else {
      const decoded = jwtDecode(token);
      // console.log(decoded.id);
      setloggedinuser(decoded.id);
    }
  };
  useEffect(() => {
    gettoken();
  }, [token]);
  // console.log(token);
  const dispatch = useDispatch();
  const getdata = useSelector((state) => state.cartReducer.carts);
  // console.log(getdata,"nav getdata")
  const RemoveItem = (id) => {
    dispatch(Removeitem(id));
  };
  const [price, setPrice] = useState(0);
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

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearCartAndUser());
    setIsLoggedIn(false);
  };

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("category/view/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      // console.log(response);
      setCategories(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // category dropdown
  const [isListVisible, setListVisible] = useState(false);

  const handleCategoryClick = () => {
    setListVisible(false);
  };

  // total items in the cart
  const [totalQuantity, settotalQuantity] = useState(false);
  const gettotalitems = () => {
    let totalQuantity = 0;
    if (getdata) {
      for (const item of getdata) {
        // Assuming each item has a 'quantity' property
        totalQuantity += item.quantity;
      }
    }
    console.log(totalQuantity, "quantitty");
    return settotalQuantity(totalQuantity);
  };
  useEffect(() => {
    gettotalitems();
  }, [getdata]);

  return (
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col-lg-2 col-md-4 col-5 d-md-flex justify-content-center">
          <div className="logo-area">
            <Link to="/">
              <img src="/assets/images/logo/logo.png" alt="logo" />
            </Link>
          </div>
        </div>
        <div className="col-lg-7 d-none d-lg-block">
          <div className="main-menu-area text-center">
            {/* <!--  Start Mainmenu Nav--> */}
            <nav className="main-navigation">
              <ul>
                <li className="active ">
                  <Link className="main-menu-list-items" to="/">
                    Home
                  </Link>
                </li>
                <li
                  onMouseEnter={() => setListVisible(true)}
                  onMouseLeave={() => setListVisible(false)}
                  className="products-tool "
                >
                  <Link className="category-down main-menu-list-items">
                    Categories
                  </Link>
                  {/* {showProductList && ( */}
                  <div
                    className="products-list row pt-1 pb-1"
                    onMouseEnter={() => setListVisible(true)}
                    onMouseLeave={() => setListVisible(false)}
                    style={{
                      opacity: isListVisible ? 1 : 0,
                      visibility: isListVisible ? "visible" : "hidden",
                      transition:
                        "opacity 0.2s ease-in, visibility 0.2s ease-in",
                    }}
                  >
                    <div className="products-list-left col-4">
                      {/* <h3>Customize Here</h3> */}
                      <img
                        className="col-3"
                        src="/assets/images/bg/category.png"
                        alt="store"
                      />
                    </div>
                    <div className="col-8">
                      <ul
                        className="products-list-row row"
                        style={{
                          visibility: isListVisible ? "visible" : "hidden",
                          opacity: isListVisible ? 1 : 0,
                          transition:
                            "opacity 0.2s ease-in, visibility 0.2s ease-in",
                        }}
                      >
                        {categories.map((cat, index) => (
                          <li className="cat-items col-3" key={index}>
                            <Link
                              className="d-flex align-items-center"
                              to={`/collections/${cat.slug}`}
                              onClick={handleCategoryClick}
                            >
                              <img
                                className="col-3"
                                src={`${renderUrl}uploads/category/${cat.image}`}
                                alt=""
                              />
                              <p className="text-center col-9">{cat.name}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="about-us-contents d-flex col-12 justify-content-start align-items-center p-3">
                        <div className="about-us-btn">
                          <Link className="btn mt-0" to="/allcategories">
                            All Categories
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* )} */}
                </li>
                <li>
                  <Link
                    className="main-menu-list-items"
                    to={`/collections/allproducts`}
                  >
                    store
                  </Link>
                </li>
                <li>
                  <Link className="main-menu-list-items" to="/about">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="main-menu-list-items" to="/contact">
                    Contact us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="col-lg-3 col-md-8 col-7 ">
          <div className="right-blok-box gap-3 d-flex justify-content-center align-items-center">
            <div className="search-wrap">
              <Link onClick={opensearch} to="#" className="trigger-search">
                {/* <i className="ion-ios-search-strong"></i> */}
                <i className="intoggle-icons bi bi-search"></i>
              </Link>
            </div>

            <div className="shopping-cart-wrap">
              <Link to="/cart">
                {/* <i className="ion-ios-cart-outline"></i>{" "} */}
                <i className="intoggle-icons bi bi-cart"></i>
                {/* {getdata && getdata.length > 0 && ( */}
                {/* <span id="cart-total">{gettotalitems}</span> */}
                <span id="cart-total">{getdata ? totalQuantity : 0}</span>

                {/* )} */}
              </Link>
              <ul className="mini-cart">
                <div className="cart-items">
                  {getdata?.length > 0 ? (
                    <>
                      {getdata.map((item, index) => (
                        <li className="cart-item" key={index}>
                          <div className="cart-image">
                            <Link to={`/productpage/${item.slug}`}>
                              <img
                                src={`${renderUrl}uploads/products/${item.images[0]}`}
                                alt={item.images[0]}
                              />
                            </Link>
                          </div>
                          <div className="cart-title">
                            <Link to={`/productpage/${item.slug}`}>
                              <h4>{item.name}</h4>
                            </Link>
                            <span className="quantity">{item.quantity}</span>
                            <div className="price-box">
                              <span className="new-price">
                                ₹{item.totalPrice}
                              </span>
                            </div>
                            <Link
                              className="remove_from_cart"
                              onClick={() => {
                                RemoveItem(item);
                              }}
                              to="#"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </Link>
                          </div>
                        </li>
                      ))}
                    </>
                  ) : (
                    <>NO items in cart.</>
                  )}
                </div>

                <li className="subtotal-titles">
                  <div className="subtotal-titles">
                    <h3>Sub-Total :</h3>
                    <span>₹ {price}</span>
                  </div>
                </li>
                <li className="mini-cart-btns">
                  <div className="cart-btns">
                    <Link to="/cart">View cart</Link>
                    {getdata?.length > 0 && (
                      <Link to="/checkout">Checkout</Link>
                    )}
                  </div>
                </li>
              </ul>
            </div>
            {/* login dropdown / button */}
            <div className="shopping-cart-wrap profile d-flex align-items-center justify-content-center">
              {isLoggedIn ? (
                <>
                  {/* <i className="fa-regular fa-circle-user"></i> */}
                  <i className="intoggle-icons bi bi-person-circle"></i>
                </>
              ) : (
                <>
                  {/* <button className="btn loginbtn"> */}
                  <Link className="btn loginbtn" to="/login-register ">
                    Login
                  </Link>
                  {/* </button> */}
                </>
              )}

              {isLoggedIn && (
                <ul className="mini-cart">
                  <li>
                    <Link to={`/profile/${loggedinuser}`}>
                      {" "}
                      <i className="fa-regular fa-circle-user"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/" onClick={logout}>
                      <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <div className="mobile-menu-btn d-block d-lg-none">
              <div className="off-canvas-btn">
                <i onClick={toggleMenu} className="ion-android-menu"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
{
  /* <li>
                  <Link to="shop.html">Pages</Link>
                  <ul className="mega-menu">
                    <li>
                      <Link to="#">Column One</Link>
                      <ul>
                        <li>
                          <Link to="compare.html">Compare Page</Link>
                        </li>
                        <li>
                          <Link to="login-register.html">
                            Login &amp; Register
                          </Link>
                        </li>
                        <li>
                          <Link to="my-account.html">My Account Page</Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="blog.html">Column two</Link>
                      <ul>
                        <li>
                          <Link to="/productpage">
                            Product Details 1
                          </Link>
                        </li>
                        <li>
                          <Link to="product-details-2.html">
                            Product Details 2
                          </Link>
                        </li>
                        <li>
                          <Link to="checkout.html">Checkout Page</Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="#">Column Three</Link>
                      <ul>
                        <li>
                          <Link to="error404.html">Error 404</Link>
                        </li>
                        <li>
                          <Link to="cart.html">Cart Page</Link>
                        </li>
                        <li>
                          <Link to="wishlist.html">Wish List Page</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li> */
}
{
  /* <li>
                      <Link to="shop-right.html">Shop Right Sidebar</Link>
                    </li>
                    <li>
                      <Link to="shop-fullwidth.html">Shop Full Width</Link>
                    </li> */
}
{
  /* <li>
                  <Link to="blog.html">Blog</Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="blog.html">Blog Left Sidebar</Link>
                    </li>
                    <li>
                      <Link to="blog-right.html">Blog Right Sidebar</Link>
                    </li>
                    <li>
                      <Link to="blog-details.html">Blog Details Page</Link>
                    </li>
                  </ul>
                </li> */
}
{
  /* <div className="user-wrap">
              <Link to="login-register.html">
                <i className="ion-android-favorite-outline"></i>
              </Link>
            </div> */
}
