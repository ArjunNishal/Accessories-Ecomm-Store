import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
// import Bloglist from "../components/Bloglist";
import Navigation from "../components/Navigation";
import Productslist from "../components/products/Productslist";

const ComboProductspage = () => {
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
          {" "}
          <Productslist />{" "}
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

export default ComboProductspage;
