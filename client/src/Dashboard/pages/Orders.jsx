import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Navigation from "../components/Navigation";
import { axiosInstance, renderUrl } from "../../config";
import moment from "moment";
import Swal from "sweetalert2";

const Orders = () => {
  // ====================dashboard================
  const navigate = useNavigate();

  // add mew member ==============================
  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 300px)" : "calc(100% - 80px)";

  // decode the token =========================
  const token = localStorage.getItem("admin");
  const decoded = jwt_decode(token);
  const loggedinuser = decoded.id;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const back = () => {
    navigate(-1);
  };

  const [orders, setOrders] = useState([]);
  const [vieworder, setvieworder] = useState({});
  console.log(vieworder, "vieworder");
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("order/view/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedOrders = response.data;

      const successfullorder = fetchedOrders.filter(
        (order => order.paymentStatus === true
      ));
      console.log(successfullorder, fetchedOrders, "orders successfull");
      // Sort the orders based on the timestamp (createdAt) in descending order
      successfullorder.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      // console.log(fetchedOrders);
      setOrders(successfullorder);
      console.log("Error fetching orders:", fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Handle the error
    }
  };

  // pack order
  const [deliverydetails, setdeliverydetails] = useState("");
  const [deliveryError, setdeliveryError] = useState("");
  const [updating, setupdating] = useState(false);
  const [orderstatus, setOrderStatus] = useState("");

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      setupdating(true);
      if (orderstatus === "out_for_delivery" && !deliverydetails) {
        setdeliveryError("*Please Enter Delivery details.*");
        return;
      }

      await axiosInstance.put(
        `order/${vieworder._id}/updateStatus`,
        {
          orderstatus,
          deliverydetails:
            orderstatus === "out_for_delivery" ? deliverydetails : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setupdating(false);
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Order Status Updated",
        text: "The order status has been updated successfully!",
      });
      fetchOrders();
      setdeliverydetails("");

      console.log("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      setupdating(false);
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update order status. Please try again later.",
      });
    }
  };

  // print the charm name
  const [charmData, setCharmData] = useState(null);
  const [error, setError] = useState(null);

  const fetchCharm = async () => {
    try {
      const response = await axiosInstance.get(`charm/getcharm`);
      const data = response.data;
      // console.log(data.name, "data");
      // return data.name;
      setCharmData(data);
    } catch (error) {
      setError("Failed to fetch charm");
    }
  };
  useEffect(() => {
    fetchCharm();
  }, []);

  const getcharmname = (id) => {
    const charm = charmData.find((item) => item._id === id);
    return charm.name;
  };

  // tabs
  // const [activeTab, setActiveTab] = useState("pills-list");
  // const handleTabClick = (tabId) => {
  //   setActiveTab(tabId);
  // };
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedOrders = orders.slice(startIndex, endIndex);

  return (
    <>
      <div
        className={`dashboard my-custom-class ${isOpen ? "open" : "closed"} ${
          isOpen ? "" : "dashboard-closed"
        }`}
      >
        {/* ========= sidebar ============ */}
        <Navigation />
        <div className="dashtoggle toggle-button" onClick={toggleSidebar}>
          {isOpen ? (
            <div className="row">
              <div className="logo1 col-2">
                <i id="times" className="fa-solid fa-times"></i>
              </div>
            </div>
          ) : (
            <i id="bars" className="bars fa-solid fa-bars col-2"></i>
          )}
        </div>
      </div>
      {/* ========= right pane =========*/}
      <div
        className="main"
        style={{ width: uploadDivWidth, right: "0px" }}
        id="upload-div"
      >
        {/* =========topbar ========= */}
        <div className="topbar">
          <h1>Welcome Admin</h1>
          <NavLink className="panelbtns btn" onClick={back}>
            <i className="fa-solid fa-angle-left"></i>&nbsp;back
          </NavLink>
        </div>
        {/*========== only admin =========== */}
        <div className="middle mt-5 container">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="user-h1">
              <i class="fa-solid fa-layer-group"></i> Orders
            </h1>
          </div>
          <hr />

          <div className=" orderlist">
            <div
              // className={`tab-pane fade show ${
              //   activeTab === "pills-list" ? "active" : ""
              // }`}
              className="orderlist-container"
            >
              {" "}
              <div className="orders-table">
                <table class="table table-striped-columns rounded">
                  <thead>
                    <tr className="table-dark text-center">
                      <th scope="col">S.No.</th>
                      <th scope="col">User Name</th>
                      <th scope="col">Mobile No.</th>
                      <th scope="col">Items</th>
                      <th scope="col">Address</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((item, index) => {
                      console.log(item.user?.username);
                      return (
                        <tr
                          key={index}
                          className={`text-center ${
                            item.orderstatus === "delivered"
                              ? "table-success"
                              : ""
                          }`}
                        >
                          <th scope="row">{index + 1}</th>
                          <td>{item.firstName} {item.user?.username ? "" : "(Guest)"}</td>
                          <td>{item.phone}</td>
                          <td>
                            <ul>
                              {item.items.map((el, index) => (
                                <li className="text-start" key={index}>
                                  {index + 1}.&nbsp;
                                  {el.name}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            {item.address.city}, {item.address.state} ,
                            {item.address.country}
                          </td>
                          <td>
                            <p className="m-0">
                              {moment(item.createdAt).format("  Do MMMM YYYY")}
                            </p>
                            <p className="m-0">
                              {moment(item.createdAt).format("  h:mm a")}
                            </p>
                          </td>
                          <td className="text-capitalize">
                            {item.orderstatus === "order_placed"
                              ? "order placed"
                              : item.orderstatus === "out_for_delivery"
                              ? "out for delivery"
                              : item.orderstatus}
                          </td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center align-items-center">
                              {/* <button
                                onClick={() => handlePackOrder(item._id)}
                                className="btn text-dark p-1 "
                              >
                                order packed
                              </button> */}
                              <Link
                                type="button"
                                className="vieworder text-dark btn p-1"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  setvieworder(item);
                                  setOrderStatus(item.orderstatus);
                                  // fetchCharm(item);
                                }}
                              >
                                <i class="fa-solid fa-eye"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="text-center my-3">
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({
                      length: Math.ceil(orders.length / itemsPerPage),
                    }).map((item, index) => {
                      if (
                        index + 1 >= currentPage - 3 &&
                        index + 1 <= currentPage + 3
                      ) {
                        return (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(index + 1)}
                              disabled={currentPage === index + 1}
                            >
                              {index + 1}
                            </button>
                          </li>
                        );
                      }
                      return null;
                    })}
                    <li
                      className={`page-item ${
                        currentPage === Math.ceil(orders.length / itemsPerPage)
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(orders.length / itemsPerPage)
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div>
            {/* Modal */}
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Modal title
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body pt-0">
                    {vieworder && Object.keys(vieworder).length > 0 && (
                      <>
                        <div className="row">
                          <div className="col-12">
                            <table className="table table-striped-columns">
                              <tbody>
                                <tr>
                                  <td>
                                    <h5>User</h5>
                                  </td>
                                  <td>
                                    <h5> {vieworder.user?.username ? vieworder.user?.username : "Guest User"}</h5>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <h6>Name on order</h6>
                                  </td>
                                  <td>
                                    <h6> {vieworder.firstName}</h6>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <b>Address</b>
                                  </td>
                                  <td colSpan="1">
                                    <p>
                                      {vieworder.address.address1}
                                      {vieworder.address.address2}, &nbsp;
                                      {vieworder.address.city}, &nbsp;
                                      {vieworder.address.state}, &nbsp;
                                      {vieworder.address.country}, &nbsp; Pin -{" "}
                                      {vieworder.address.postcode}
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <b>Phone</b>
                                  </td>
                                  <td>
                                    <p> {vieworder.phone}</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <b>Email</b>
                                  </td>
                                  <td>
                                    <p> {vieworder.email}</p>
                                  </td>
                                </tr>
                                {vieworder.orderNotes && (
                                  <tr>
                                    <td>
                                      <b>Order Notes</b>
                                    </td>
                                    <td>
                                      <p> {vieworder.orderNotes}</p>
                                    </td>
                                  </tr>
                                )}
                                <tr>
                                  <td>
                                    <b>Date of Order</b>
                                  </td>
                                  <td>
                                    <p>
                                      {" "}
                                      {moment(vieworder.createdAt).format(
                                        "  Do MMMM YYYY, h:mm a"
                                      )}
                                    </p>
                                  </td>
                                </tr>
                                {vieworder.isPacked && (
                                  <tr>
                                    <td>
                                      <b>Delivery Details</b>
                                    </td>
                                    <td>
                                      <p> {vieworder.deliverydetails}</p>
                                    </td>
                                  </tr>
                                )}
                                <tr>
                                  <td>
                                    <b>Order Status</b>
                                  </td>
                                  <td>
                                    <p>
                                      {" "}
                                      {vieworder.orderstatus === "order_placed"
                                        ? "order placed"
                                        : vieworder.orderstatus ===
                                          "out_for_delivery"
                                        ? "out for delivery"
                                        : vieworder.orderstatus}
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <b>Order Amount</b>
                                  </td>
                                  <td>
                                    <p> {vieworder.ordertotal}</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <b>Discount</b>
                                  </td>
                                  <td>
                                    <p>
                                      {" "}
                                      {
                                        vieworder.appliedCoupon?.discountedPrice
                                      }{" "}
                                      (Code -{" "}
                                      <b>{vieworder.appliedCoupon?.code}</b>)
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-12 py-5">
                            <h4>Items</h4>
                            <hr />
                            <ol>
                              {vieworder.items.map((item, index) => {
                                return (
                                  <li key={index}>
                                    <div className="row">
                                      <div className="col-3">
                                        <p>
                                          <b>{item.name}</b>
                                        </p>
                                        <img
                                          className="cardimg"
                                          src={`${renderUrl}uploads/products/${item.images[0]}`}
                                          alt={item.images[0]}
                                        />
                                      </div>
                                      <div className="col-9">
                                        <div className="row">
                                          <div className="col-3">
                                            {item.nameOnProduct && (
                                              <p className="mb-0">
                                                {" "}
                                                <b className="mb-0">
                                                  Name on product
                                                </b>
                                              </p>
                                            )}
                                            {item.mobilename && (
                                              <p className="mb-0">
                                                {" "}
                                                <b className="mb-0">
                                                  Mobile Model
                                                </b>
                                              </p>
                                            )}
                                            {item.nameOnProduct1 && (
                                              <p className="mb-0">
                                                <b className="mb-0">
                                                  Name on product 1{" "}
                                                </b>
                                              </p>
                                            )}
                                            {item.nameOnProduct2 && (
                                              <p className="mb-0">
                                                <b className="mb-0">
                                                  Name on product 2{" "}
                                                </b>
                                              </p>
                                            )}
                                            {item.selectedfont && (
                                              <p className="mb-0">
                                                {" "}
                                                <b className="mb-0">Font:</b>
                                              </p>
                                            )}
                                            {item.selectedmodel && (
                                              <p className="mb-0">
                                                <b className="mb-0">Model</b>
                                              </p>
                                            )}
                                            {item.giftWrap && (
                                              <p>
                                                <b className="mb-0">
                                                  Gift Wrap
                                                </b>
                                              </p>
                                            )}
                                            {item.selectedCharm && (
                                              <p>
                                                <b>Charm </b>
                                              </p>
                                            )}
                                            {item.color && (
                                              <p>
                                                <b>Color </b>
                                              </p>
                                            )}
                                            {item.singleImage && (
                                              <>
                                                <p>
                                                  <b>Selected Images </b>
                                                </p>
                                              </>
                                            )}
                                            {item.multipleImage !== null &&
                                              item.multipleImage !==
                                                undefined &&
                                              item.multipleImage.length > 0 && (
                                                <>
                                                  <p>
                                                    <b>Selected Images </b>
                                                  </p>
                                                </>
                                              )}
                                            {item.productType === "combo" && (
                                              <>
                                                <hr />
                                                <b>Item Details</b>
                                              </>
                                            )}
                                          </div>
                                          <div className="col-9">
                                            {item.nameOnProduct && (
                                              <p className="mb-0">
                                                : {item.nameOnProduct}
                                              </p>
                                            )}
                                            {item.mobilename && (
                                              <p className="mb-0">
                                                : {item.mobilename}
                                              </p>
                                            )}
                                            {item.nameOnProduct1 && (
                                              <p className="mb-0">
                                                : {item.nameOnProduct1}
                                              </p>
                                            )}
                                            {item.nameOnProduct2 && (
                                              <p className="mb-0">
                                                : {item.nameOnProduct2}
                                              </p>
                                            )}
                                            {item.selectedfont && (
                                              <p className="mb-0">
                                                : {item.selectedfont}
                                              </p>
                                            )}
                                            {item.selectedmodel && (
                                              <p className="mb-0">
                                                : {item.selectedmodel}
                                              </p>
                                            )}
                                            {item.giftWrap && (
                                              <p className="mb-0">: Yes</p>
                                            )}
                                            {item.selectedCharm && (
                                              <p>
                                                :{" "}
                                                {
                                                  charmData.find(
                                                    (el) =>
                                                      el._id ==
                                                      item.selectedCharm
                                                  ).name
                                                }
                                              </p>
                                            )}
                                            {item.color && (
                                              <p>
                                                :{" "}
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
                                                <div className="image-container">
                                                  <img
                                                    className="p-1"
                                                    style={{
                                                      width: "100px",
                                                      maxHeight: "100px",
                                                      objectFit: "contain",
                                                    }}
                                                    src={`${renderUrl}uploads/cartimages/${item.singleImage}`}
                                                    alt={item.singleImage}
                                                  />
                                                  <a
                                                    className="download-link"
                                                    href={`${renderUrl}uploads/cartimages/${item.singleImage}`}
                                                    download
                                                  >
                                                    Download
                                                  </a>
                                                </div>
                                              </>
                                            )}
                                            {item.multipleImage !== null &&
                                              item.multipleImage !==
                                                undefined &&
                                              item.multipleImage.length > 0 && (
                                                <>
                                                  <div className="row">
                                                    {item.multipleImage.map(
                                                      (img, index) => (
                                                        <div
                                                          key={index}
                                                          className="col-3 py-1 image-container"
                                                        >
                                                          <img
                                                            style={{
                                                              maxHeight:
                                                                "100px",
                                                              objectFit:
                                                                "contain",
                                                            }}
                                                            src={`${renderUrl}uploads/cartimages/${img}`}
                                                            alt={img}
                                                          />
                                                          <a
                                                            className="download-link"
                                                            href={`${renderUrl}uploads/cartimages/${img}`}
                                                            download
                                                          >
                                                            Download
                                                          </a>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </>
                                              )}
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
                                                        item[dynamicFieldName];

                                                      if (
                                                        field.startsWith(
                                                          "single-image"
                                                        )
                                                      ) {
                                                        if (dynamicFieldValue) {
                                                          return (
                                                            <div key={index}>
                                                              <div>
                                                                <b>
                                                                  single image
                                                                  for{" "}
                                                                  {productValue}{" "}
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
                                                                  {productValue}
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
                                                        if (dynamicFieldValue) {
                                                          const charmName =
                                                            getcharmname(
                                                              dynamicFieldValue
                                                            );
                                                          console.log(
                                                            charmName,
                                                            "charm"
                                                          );
                                                          return (
                                                            <div key={index}>
                                                              <b>
                                                                {field}{" "}
                                                                {productValue}
                                                              </b>{" "}
                                                              : {charmName}
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
                                                          : {dynamicFieldValue}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                ))}
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        {/* <p><b>name on product: </b></p> */}
                                      </div>
                                    </div>
                                    <hr />
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                          <div>
                            <label htmlFor="orderstatus">
                              <b>Select Order Status:</b>
                            </label>
                            <div>
                              <input
                                type="checkbox"
                                id="order_placed"
                                name="orderstatus"
                                value="order_placed"
                                checked={orderstatus === "order_placed"}
                                onChange={handleStatusChange}
                              />
                              <label htmlFor="order_placed">
                                &nbsp;Order Placed
                              </label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="confirmed"
                                name="orderstatus"
                                value="confirmed"
                                checked={orderstatus === "confirmed"}
                                onChange={handleStatusChange}
                              />
                              <label htmlFor="confirmed">&nbsp;Confirmed</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="packed"
                                name="orderstatus"
                                value="packed"
                                checked={orderstatus === "packed"}
                                onChange={handleStatusChange}
                              />
                              <label htmlFor="packed">&nbsp;Packed</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="out_for_delivery"
                                name="orderstatus"
                                value="out_for_delivery"
                                checked={orderstatus === "out_for_delivery"}
                                onChange={handleStatusChange}
                              />
                              <label htmlFor="out_for_delivery">
                                &nbsp;Out for Delivery
                              </label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="delivered"
                                name="orderstatus"
                                value="delivered"
                                checked={orderstatus === "delivered"}
                                onChange={handleStatusChange}
                              />
                              <label htmlFor="delivered">&nbsp;Delivered</label>
                            </div>

                            {vieworder.orderstatus === "out_for_delivery" ||
                              (orderstatus === "out_for_delivery" && (
                                <div className="delivery">
                                  <label
                                    htmlFor="delivery"
                                    className="form-label"
                                  >
                                    Enter Delivery Agent details
                                  </label>
                                  <textarea
                                    name="delivery"
                                    id="delivery"
                                    value={deliverydetails}
                                    onChange={(event) =>
                                      setdeliverydetails(event.target.value)
                                    }
                                    className="col-12"
                                    rows="5"
                                  ></textarea>
                                  <p className="text-danger">{deliveryError}</p>
                                </div>
                              ))}
                            {updating ? (
                              <div
                                className="spinner-border text-success"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            ) : (
                              <button
                                className="btn"
                                onClick={handleUpdateStatus}
                              >
                                Update Status
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ============================ bottom ================ */}
        <div className="bottom">
          <div className="bottombar">
            <h6>
              <i className="fa-regular fa-copyright"></i> powered by{" "}
              <a
                className="intoggle-powered text-decoration-none"
                href="https://www.intoggle.com/"
              >
                Intoggle
              </a>
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
