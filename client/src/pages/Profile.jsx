import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import jwtDecode from "jwt-decode";
import { axiosInstance, renderUrl } from "../config";
import moment from "moment";
import Swal from "sweetalert2";
import { clearCartAndUser } from "../redux/actions/action";
import { useDispatch } from "react-redux";

const Profile = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userid = decoded.id;
  console.log(userid, decoded, "userid");

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`admin/view/profile/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setPhone(response.data.mobileno);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  const [user, setUser] = useState({});

  // get orders of the user
  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(
        `order/view/ordersuser/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedOrders = response.data;
      setOrders(fetchedOrders);
      console.log("Error fetching orders:", fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Handle the error
    }
  };

  // reset password
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  // console.log(password, confirmPassword);

  // password reset

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (password !== confirmPassword) {
  //     setMessage("Passwords do not match");
  //     return;
  //   }

  //   try {
  //     const data = { password, confirmPassword };
  //     console.log("started", data);
  //     const response = await axiosInstance.put(
  //       `user/resetpassword/${userid}/${token}`,
  //       data,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // Show success message using SweetAlert
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success!",
  //       text: response.data, // This should be the success message from the server response
  //     });
  //     setshowchangepass(false);
  //     fetchUserProfile();
  //   } catch (error) {
  //     console.error("Error resetting password:", error);
  //     setMessage("Failed to reset password. Please try again later.");
  //   }
  // };

  // reset profile details
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = { username, email, phone };
      const response = await axiosInstance.put("user/updateProfile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Profile updated successfully!",
        });
        setshowupdateProfile(false);
        fetchUserProfile();
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again later.");
    }
  };
  // show password change or profile update
  const [showchangepass, setshowchangepass] = useState(false);
  const [showupdateProfile, setshowupdateProfile] = useState(false);

  // logout
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearCartAndUser());
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
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Header />
      {/* breadcrumb-area start */}
      <div className="collection breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="breadcrumb-title">My account</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link to="">Home</Link>
                </li>
                <li className="breadcrumb-item active">My account</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}
      {/* main-content-wrap start */}
      <div className="main-content-wrap section-ptb my-account-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="account-dashboard">
                <div className="dashboard-upper-info">
                  <div className="row align-items-center no-gutters">
                    <div className="col-lg-3 col-md-12">
                      <div className="d-single-info">
                        <p className="user-name">
                          Hello <span>{user.email}</span>
                        </p>
                        {/* <p>
                          (not yourmail@info? <Link to="#">Log Out</Link>)
                        </p> */}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                      <div className="d-single-info">
                        <p>Need Assistance? Customer service at.</p>
                        <p>care.customizehere@gmail.com</p>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-12">
                      <div className="d-single-info">
                        <p>E-mail us at </p>
                        <p>care.customizehere@gmail.com</p>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-12">
                      <div className="d-single-info text-lg-center">
                        <Link to="/cart" className="view-cart">
                          <i className="fa fa-cart-plus" />
                          &nbsp;view cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-lg-2">
                    {/* Nav tabs */}
                    <div className="nav dashboard-list">
                      <button
                        type="button"
                        data-bs-toggle="tab"
                        data-bs-target="#dashboard"
                        className="nav-link active"
                      >
                        Dashboard
                      </button>
                      <button
                        type="button"
                        data-bs-toggle="tab"
                        data-bs-target="#account-details"
                        className="nav-link"
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        data-bs-toggle="tab"
                        data-bs-target="#orders"
                        className="nav-link"
                      >
                        Orders
                      </button>
                      {/* <button
                        type="button"
                        data-bs-toggle="tab"
                        data-bs-target="#address"
                        className="nav-link"
                      >
                        Addresses
                      </button> */}

                      <Link to="/" onClick={logout} className="nav-link">
                        logout
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-10">
                    {/* Tab panes */}
                    <div className="tab-content dashboard-content">
                      <div className="tab-pane active" id="dashboard">
                        <h3>Dashboard </h3>
                        <p>
                          From your account dashboard. you can easily check
                          &amp; view your <Link to="#">recent orders</Link>,
                          manage your{" "}
                          <Link to="#">shipping and billing addresses</Link> and{" "}
                          <Link to="#">
                            edit your password and account details.
                          </Link>
                        </p>
                      </div>
                      <div className="tab-pane fade" id="orders">
                        <h3>Orders</h3>
                        <div className="table-responsive profile-orders d-md-block d-none">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Items</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Orders.map((order, index) => {
                                return (
                                  <tr key={index}>
                                    <td style={{ width: "20px" }}>
                                      {index + 1}
                                    </td>
                                    <td>
                                      {" "}
                                      {moment(order.createdAt).format(
                                        "  Do MMMM YYYY, h:mm a"
                                      )}
                                    </td>
                                    <td>
                                      {order.orderstatus === "order_placed"
                                        ? "order placed"
                                        : order.orderstatus ===
                                          "out_for_delivery"
                                        ? "out for delivery"
                                        : order.orderstatus}
                                    </td>
                                    <td> ₹{order.ordertotal}</td>
                                    <td>
                                      <ol>
                                        {order.items.map((item, index) => {
                                          console.log(
                                            item.multipleImage,
                                            "multiple"
                                          );
                                          return (
                                            <li key={index}>
                                              <b>{item.name}</b>
                                              <div>
                                                {item.nameOnProduct && (
                                                  <p className="mb-0">
                                                    Name on product :{" "}
                                                    {item.nameOnProduct}
                                                  </p>
                                                )}
                                                {item.nameOnProduct1 && (
                                                  <p className="mb-0">
                                                    Name on product 1:{" "}
                                                    {item.nameOnProduct1}
                                                  </p>
                                                )}
                                                {item.nameOnProduct2 && (
                                                  <p className="mb-0">
                                                    Name on product 2:{" "}
                                                    {item.nameOnProduct2}
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
                                                  <p className="mb-0">
                                                    Gift Wrap : Yes
                                                  </p>
                                                )}
                                                {item.selectedCharm && (
                                                  <p>
                                                    Charm :{" "}
                                                    {
                                                      charms.find(
                                                        (el) =>
                                                          el._id ==
                                                          item.selectedCharm
                                                      ).name
                                                    }
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
                                                  item.multipleImage !==
                                                    undefined &&
                                                  item.multipleImage.length >
                                                    0 && (
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
                                                                maxHeight:
                                                                  "100px",
                                                                objectFit:
                                                                  "contain",
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
                                              {item.productType === "combo" && (
                                                <>
                                                  {Object.keys(
                                                    item.options.options[0]
                                                  ).map((keyname, i) => (
                                                    <div key={i}>
                                                      <hr />
                                                      {item.options.options[0][
                                                        keyname
                                                      ].map((field, index) => {
                                                        const productValue =
                                                          item?.options
                                                            .products[0][
                                                            `product${i}`
                                                          ];
                                                        const dynamicFieldName = `${field}-${productValue}`;
                                                        const dynamicFieldValue =
                                                          item[
                                                            dynamicFieldName
                                                          ];

                                                        if (
                                                          field.startsWith(
                                                            "single-image"
                                                          )
                                                        ) {
                                                          if (
                                                            dynamicFieldValue
                                                          ) {
                                                            return (
                                                              <div key={index}>
                                                                <div>
                                                                  <b>
                                                                    single image
                                                                    for{" "}
                                                                    {
                                                                      productValue
                                                                    }{" "}
                                                                    :
                                                                  </b>
                                                                </div>
                                                                <img
                                                                  style={{
                                                                    maxHeight:
                                                                      "100px",
                                                                    maxWidth:
                                                                      "100px",
                                                                    objectFit:
                                                                      "contain",
                                                                  }}
                                                                  src={`${renderUrl}uploads/cartimages/${dynamicFieldValue}`}
                                                                  alt={`${field}-${productValue}`}
                                                                />
                                                              </div>
                                                            );
                                                          }
                                                        } else if (
                                                          field.startsWith(
                                                            "multiple-image"
                                                          )
                                                        ) {
                                                          if (
                                                            Array.isArray(
                                                              dynamicFieldValue
                                                            ) &&
                                                            dynamicFieldValue.length >
                                                              0
                                                          ) {
                                                            return (
                                                              <div key={index}>
                                                                <div>
                                                                  <b>
                                                                    Multiple
                                                                    Images for{" "}
                                                                    {
                                                                      productValue
                                                                    }
                                                                    :
                                                                  </b>
                                                                </div>
                                                                {dynamicFieldValue.map(
                                                                  (
                                                                    imageUrl,
                                                                    imgIndex
                                                                  ) => (
                                                                    <img
                                                                      style={{
                                                                        maxHeight:
                                                                          "100px",
                                                                        maxWidth:
                                                                          "100px",
                                                                        objectFit:
                                                                          "contain",
                                                                      }}
                                                                      key={
                                                                        imgIndex
                                                                      }
                                                                      src={`${renderUrl}uploads/cartimages/${imageUrl}`}
                                                                      alt={`${field}-${productValue}-${imgIndex}`}
                                                                    />
                                                                  )
                                                                )}
                                                              </div>
                                                            );
                                                          }
                                                        } else if (
                                                          field.startsWith(
                                                            "charmtag"
                                                          )
                                                        ) {
                                                          if (
                                                            dynamicFieldValue
                                                          ) {
                                                            return (
                                                              <div key={index}>
                                                                <b>
                                                                  {field}{" "}
                                                                  {productValue}
                                                                </b>{" "}
                                                                :
                                                                {
                                                                  charms.find(
                                                                    (el) =>
                                                                      el._id ==
                                                                      dynamicFieldValue
                                                                  ).name
                                                                }
                                                              </div>
                                                            );
                                                          }
                                                        }

                                                        return (
                                                          <div key={index}>
                                                            <b>
                                                              {field}{" "}
                                                              {productValue}
                                                            </b>{" "}
                                                            :{" "}
                                                            {dynamicFieldValue}
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  ))}
                                                </>
                                              )}
                                            </li>
                                          );
                                        })}
                                      </ol>
                                    </td>

                                    {/* <td>
                                    <Link to="" className="view">
                                      view
                                    </Link>
                                  </td> */}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="mobile-order-list d-md-none d-block">
                          {Orders.map((order, index) => (
                            <div
                              className="mobile-order-item border shadow rounded my-3"
                              key={index}
                            >
                              <h5 className="bg-dark rounded text-white p-2">
                                {index + 1}. Order details
                              </h5>
                              {/* <hr /> */}
                              <div className="px-2">
                                <div>
                                  <b>Date :</b>{" "}
                                  {moment(order.createdAt).format(
                                    "  Do MMMM YYYY, h:mm a"
                                  )}
                                </div>
                                <div>
                                  <b> Status :</b>{" "}
                                  {order.isPacked ? "Packed" : "Order Placed"}
                                </div>
                                <div>
                                  <b>Total :</b> ₹{order.ordertotal}
                                </div>
                                <hr />
                                <div>
                                  <h5>Items</h5>
                                  <div>
                                    <ol>
                                      {order.items.map((item, index) => {
                                        console.log(
                                          item.multipleImage,
                                          "multiple"
                                        );
                                        return (
                                          <li key={index}>
                                            <b>{item.name}</b>
                                            <div>
                                              {item.nameOnProduct && (
                                                <p className="mb-0">
                                                  Name on product :{" "}
                                                  {item.nameOnProduct}
                                                </p>
                                              )}
                                              {item.nameOnProduct1 && (
                                                <p className="mb-0">
                                                  Name on product 1:{" "}
                                                  {item.nameOnProduct1}
                                                </p>
                                              )}
                                              {item.nameOnProduct2 && (
                                                <p className="mb-0">
                                                  Name on product 2:{" "}
                                                  {item.nameOnProduct2}
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
                                                <p className="mb-0">
                                                  Gift Wrap : Yes
                                                </p>
                                              )}
                                              {item.selectedCharm && (
                                                <p>
                                                  Charm :{" "}
                                                  {
                                                    charms.find(
                                                      (el) =>
                                                        el._id ==
                                                        item.selectedCharm
                                                    ).name
                                                  }
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
                                                item.multipleImage !==
                                                  undefined &&
                                                item.multipleImage.length >
                                                  0 && (
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
                                                              maxHeight:
                                                                "100px",
                                                              objectFit:
                                                                "contain",
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
                                          </li>
                                        );
                                      })}
                                    </ol>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* <div className="tab-pane" id="address">
                        <p>
                          The following addresses will be used on the checkout
                          page by default.
                        </p>
                        <h4 className="billing-address">Billing address</h4>
                        <Link to="#" className="view">
                          edit
                        </Link>
                        <p className="biller-name">Johan Don</p>
                        <p>India</p>
                      </div> */}
                      <div className="tab-pane fade" id="account-details">
                        <h3>Profile </h3>
                        <div className="profile-details">
                          <div className="d-flex">
                            <h3>{user.username}</h3>
                          </div>
                          <div>
                            <p>
                              <b>Email : </b> {user.email}
                            </p>
                            <p>
                              <b>Mobile No. : </b> {user.mobileno}
                            </p>

                            <button
                              onClick={() => {
                                setshowupdateProfile(true);
                                setshowchangepass(false);
                              }}
                              className="btn mx-2 p-2"
                            >
                              Edit Profile
                            </button>

                            {/* <button
                              onClick={() => {
                                setshowchangepass(true);
                                setshowupdateProfile(false);
                              }}
                              className="btn mx-2 p-2"
                            >
                              reset password
                            </button> */}
                          </div>
                        </div>
                        <div className="password-form p-3">
                          {/* {showchangepass && (
                            <form className="col-6" onSubmit={handleSubmit}>
                              <hr />
                              <div>
                                <h4>Change Password</h4>
                                <label
                                  className="form-label mt-2"
                                  htmlFor="password"
                                >
                                  New Password:
                                </label>
                                <input
                                  className="form-control"
                                  type="password"
                                  id="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  className="form-label mt-2"
                                  htmlFor="confirmPassword"
                                >
                                  Confirm Password:
                                </label>
                                <input
                                  className="form-control"
                                  type="password"
                                  id="confirmPassword"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  required
                                />
                              </div>
                              {message && <p>{message}</p>}
                              <button
                                className="btn corporate-gifts p-2 my-2"
                                type="submit"
                              >
                                Reset Password
                              </button>
                            </form>
                          )} */}
                          {showupdateProfile && (
                            <form
                              className="p-3 col-6"
                              onSubmit={handleProfileSubmit}
                            >
                              <hr />
                              <div>
                                <h4>Update Profile</h4>
                                <label
                                  className="form-label mt-2"
                                  htmlFor="username"
                                >
                                  Username:
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="username"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  className="form-label mt-2"
                                  htmlFor="email"
                                >
                                  Email:
                                </label>
                                <input
                                  className="form-control"
                                  type="email"
                                  id="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  className="form-label mt-2"
                                  htmlFor="phone"
                                >
                                  Phone:
                                </label>
                                <input
                                  className="form-control"
                                  type="tel"
                                  id="phone"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  required
                                />
                              </div>
                              {message && <p>{message}</p>}
                              <button
                                className="btn corporate-gifts p-2 my-2"
                                type="submit"
                              >
                                Update Profile
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* main-content-wrap end */}
      <Footer />
    </div>
  );
};

export default Profile;
