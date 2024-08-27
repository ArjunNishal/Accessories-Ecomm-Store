import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Navigation = () => {
  const navigate = useNavigate("");
  const logout = () => {
    // localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };
  // decode the token =========================
  const token = localStorage.getItem("admin");
  const decoded = jwt_decode(token);
  const loggedinuser = decoded.id;
  const userRole = decoded.role;
  return (
    <div className="navigation">
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/admin" className="nav-link" activeclassname="active">
            <span className="icon">
              <i className="fa-sharp fa-solid fa-home"></i>
            </span>
            <span className="title">&nbsp;Dashboard</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/products" className="nav-link" activeclassname="active">
            <span className="icon">
              <i className="fa-solid fa-boxes-stacked"></i>
            </span>
            <span className="title">&nbsp;Products</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/categories"
            className="nav-link"
            activeclassname="active"
          >
            <span className="icon">
              <i className="fa-brands fa-slack"></i>
            </span>
            <span className="title">&nbsp;Categories</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/coupons" className="nav-link" activeclassname="active">
            <span className="icon">
              <i className="fa-solid fa-money-check"></i>
            </span>
            <span className="title">&nbsp;Offers & Coupons</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/charms" className="nav-link" activeclassname="active">
            <span className="icon">
              <i className="fa-solid fa-clover"></i>
            </span>
            <span className="title">&nbsp;Charms</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/pen-models" className="nav-link" activeclassname="active">
            <span className="icon">
              <i class="fa-solid fa-pen"></i>
            </span>
            <span className="title">&nbsp;Pen Models</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/orders" className="nav-link" activeclassname="active">
            <span className="icon">
              <i className="fa-solid fa-layer-group"></i>
            </span>
            <span className="title">&nbsp;Orders</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/"
            className="nav-link"
            activeclassname="active"
            onClick={logout}
          >
            <span className="icon">
              <i className="fa-solid fa-right-from-bracket"></i>
            </span>
            <span className="title">&nbsp;logout</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
