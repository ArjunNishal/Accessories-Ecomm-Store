import React, { useState, useEffect, useRef } from "react";
import { axiosInstance, renderUrl } from "../../config";
import Profile from "../pages/Profile";
import jwtdecode from "jwt-decode";
import { Link } from "react-router-dom";

const Adminpage = () => {
  const [user, setUser] = useState({});
  const token = localStorage.getItem("admin");
  const decoded = jwtdecode(token);
  const loggedinuser = decoded.id;
  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `admin/view/profile/${loggedinuser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data, "response");
      setUser(response.data);
    } catch (error) {
      console.log("Failed to fetch user profile.", error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <>
      <div className="d-flex adminpage-head justify-content-between align-items-center">
        <h1 className="user-h1">
          <i className="fa-sharp fa-solid fa-home"></i> Dashboard
        </h1>
        <button
          onClick={toggleProfile}
          className="profilepic"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          <img
            src={`${renderUrl}uploads/admins/${user.image}`}
            alt="profile pic"
          />
        </button>
      </div>
      <hr />

      <div className="collapse" id="collapseExample">
        <div className="card card-body">
          <div className="profile-content">
            {" "}
            <Profile />
          </div>
        </div>
      </div>

      <div className="dashboard-page my-3">
        <div className="row justify-content-center gap-5 align-items-center">
          <div className="col-3 border p-3 rounded text-center d-flex flex-column">
            <i className="fa-solid fa-boxes-stacked m-3"></i>
            <div>
              {" "}
              <Link to="/products">
                <button className="btn btn-danger">Products</button>{" "}
              </Link>
            </div>
          </div>
          
          <div className="col-3 border p-3 rounded text-center d-flex flex-column">
            <i className="fa-brands fa-slack m-3"></i>
            <div>
              <Link to="/categories">
                <button className="btn btn-danger">Categories</button>{" "}
              </Link>
            </div>
          </div>
          <div className="col-3 border p-3 rounded text-center d-flex flex-column">
            <i className="fa-solid fa-money-check m-3"></i>
            <div>
              {" "}
              <Link to="/coupons">
                <button className="btn btn-danger">Offers & Coupons</button>{" "}
              </Link>
            </div>
          </div>
          <div className="col-3 border p-3 rounded text-center d-flex flex-column">
            <i className="fa-solid fa-clover m-3"></i>
            <div>
              {" "}
              <Link to="/charms">
                <button className="btn btn-danger">Charms</button>{" "}
              </Link>
            </div>
          </div>
          <div className="col-3 border p-3 rounded text-center d-flex flex-column">
            <i className="fa-solid fa-pen m-3"></i>
            <div>
              {" "}
              <Link to="/pen-models">
                <button className="btn btn-danger">Pen Models</button>{" "}
              </Link>
            </div>
          </div>
          <div className="col-3 border p-3 rounded text-center d-flex flex-column">
            <i className="fa-solid fa-layer-group m-3"></i>
            <div>
              {" "}
              <Link to="/orders">
                <button className="btn btn-danger">Orders</button>{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminpage;
