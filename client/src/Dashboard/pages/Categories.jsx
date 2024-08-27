import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Adminpage from "../components/Adminpage";
import Navigation from "../components/Navigation";
import { axiosInstance, token } from "../../config";
import AddCategoryForm from "../components/AddCategoryForm";
import Swal from "sweetalert2";
import Editcategory from "../components/Editcategory";

const Categories = () => {
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

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("category/view/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      // console.log(response)
      setCategories(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [showaddcategory, setshowaddcategory] = useState(false);
  const [showeditcat, setshoweditcat] = useState(false);
  const [editcatid, seteditcatid] = useState(false);
  const closeedit = () => {
    setshoweditcat(!showeditcat);
  };

  const handleRemoveCategory = async (categoryId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `category/remove/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchCategories();
        Swal.fire({
          icon: "success",
          text: response.data.message,
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          text: "Failed to delete category",
        });
      }
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
              <i className="fa-brands fa-slack"></i> Categories
            </h1>
            <div>
              {showaddcategory ? (
                <button
                  onClick={() => {
                    setshowaddcategory(false);
                    setshoweditcat(false);
                  }}
                  className=" addcategory-btn btn btn-primary"
                >
                  All categories
                </button>
              ) : (
                <button
                  onClick={() => {
                    setshowaddcategory(true);
                  }}
                  className="addcategory-btn btn btn-success"
                >
                  + Add new category
                </button>
              )}
            </div>
          </div>
          <hr />
          {showaddcategory ? (
            <div className="container">
              <AddCategoryForm categories={fetchCategories} />
            </div>
          ) : showeditcat ? (
            <div className="container">
              <Editcategory
                categories={editcatid}
                fetchCategories={fetchCategories}
                showeditcat={closeedit}
              />
            </div>
          ) : (
            <div className="categories-container container">
              <div className="row justify-content-center">
                {categories.map((category) => (
                  <div
                    className="col-3 d-flex justify-content-between align-items-center border rounded m-2"
                    key={category._id}
                  >
                    <h6 className=" p-2">{category.name}</h6>
                    {/* Render additional category details here */}
                    <div>
                      <button
                        onClick={() => {
                          setshoweditcat(true);
                          seteditcatid(category);
                        }}
                        className="mx-1 btn btn-outline-primary"
                      >
                        {" "}
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveCategory(category._id);
                        }}
                        className=" btn btn-outline-danger"
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

export default Categories;
