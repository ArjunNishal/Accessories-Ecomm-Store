import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Adminpage from "../components/Adminpage";
import Navigation from "../components/Navigation";
import { axiosInstance ,token } from "../../config";
import Swal from "sweetalert2";
import CreateOfferComponent from "../components/CreateOfferComponent ";
import AddCouponForm from "../components/AddCouponForm ";

const CouponAndOffers = () => {
  // ====================dashboard================
  const navigate = useNavigate();

  // add mew member ==============================
  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 300px)" : "calc(100% - 80px)";

  // decode the token =========================
  const token = localStorage.getItem("admin");
  const decoded = jwt_decode(token);
  const loggedinuser = decoded.id;
  const userRole = decoded.role;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const back = () => {
    navigate(-1);
  };

  const [offers, setOffers] = useState([]);
  const [coupons, setcoupons] = useState([]);

  const fetchOffers = async () => {
    try {
      const response = await axiosInstance.get("offer/view/offers",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOffers(response.data);
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message to the user
    }
  };
  useEffect(() => {
    fetchOffers();
  }, []);

  const [showaddoffer, setshowaddoffer] = useState(false);
  const [showaddcoupon, setshowaddcoupon] = useState(false);

  const deleteOffer = async (offerId) => {
    try {
      const result = await Swal.fire({
        title: "Delete Offer",
        text: "Are you sure you want to delete this offer?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axiosInstance.delete(
          `offer/deleteoffer/${offerId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
        fetchOffers();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete offer",
      });
    }
  };

  const getCoupons = async () => {
    try {
      const response = await axiosInstance.get("coupon/getcoupons",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const coupons = response.data;
      setcoupons(coupons);
      console.log(coupons);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  const deleteCoupon = async (couponId) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "You are about to delete the coupon. This action cannot be undone.",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await axiosInstance.delete(
          `coupon/deletecoupon/${couponId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Coupon deleted successfully",
          });
          getCoupons();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to delete coupon",
            text: response.data.message,
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed to delete coupon",
        text: "An error occurred while deleting the coupon.",
      });
    }
  };

  return (
    <div>
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
              <i className="fa-solid fa-money-check"></i> Offers And Coupons
            </h1>
          </div>
          <hr />
          <div className="row justify-content-center p-3">
            <div className="col-6  p-2">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <h4>Offers</h4>
                  {showaddoffer ? (
                    <button
                      onClick={() => {
                        setshowaddoffer(false);
                        fetchOffers();
                      }}
                      className="btn btn-outline-primary"
                    >
                      All Offers
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setshowaddoffer(true);
                      }}
                      className="btn btn-outline-success"
                    >
                      add offer
                    </button>
                  )}
                </div>
                <hr />
              </div>
              {showaddoffer ? (
                <>
                  <div className="d-flex justify-content-center ">
                    <CreateOfferComponent />
                  </div>
                </>
              ) : (
                <div>
                  <div className="row justify-content-center">
                    {offers.map((offer) => (
                      <div
                        className="p-2 d-flex justify-content-between align-items-center col-5 m-1 border rounded"
                        key={offer._id}
                      >
                        <p className="m-0">{offer.name}</p>
                        <div>
                          <button
                            onClick={() => {
                              deleteOffer(offer._id);
                            }}
                            className="btn btn-outline-danger"
                          >
                            {" "}
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-6 p-2">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <h4>Coupons</h4>
                  {showaddcoupon ? (
                    <button
                      onClick={() => {
                        setshowaddcoupon(false);
                        getCoupons();
                      }}
                      className="btn btn-outline-primary"
                    >
                      All Coupons
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setshowaddcoupon(true);
                      }}
                      className="btn btn-outline-success"
                    >
                      Add Coupon
                    </button>
                  )}
                </div>
                <hr />
                {showaddcoupon ? (
                  <>
                    <div className="d-flex justify-content-center ">
                      <AddCouponForm />
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="row justify-content-center">
                      {coupons.map((coupon) => (
                        <div
                          className="p-2 d-flex justify-content-between align-items-center col-5 m-1 border rounded"
                          key={coupon._id}
                        >
                          <p className="m-0">{coupon.code}</p>
                          <div>
                            <button
                              onClick={() => {
                                deleteCoupon(coupon._id);
                              }}
                              className="btn btn-outline-danger"
                            >
                              {" "}
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
    </div>
  );
};

export default CouponAndOffers;
