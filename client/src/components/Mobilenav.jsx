import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../config";

const Mobilenav = ({ isMenuOpen, closeMenu }) => {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("category/view/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`off-canvas-wrapper ${isMenuOpen ? "open" : ""}`}>
      <div className="off-canvas-overlay" onClick={closeMenu}></div>
      <div className="off-canvas-inner-content">
        <div className="btn-close-off-canvas" onClick={closeMenu}>
          <i className="ion-android-close"></i>
        </div>
        <div className="off-canvas-inner">
          {/* mobile menu start */}
          <div className="mobile-navigation">
            <div className="mobile-logo d-flex m-0">
              <div className="col-6">
                <Link to="/">
                  <img src="/assets/images/logo/logo.png" alt="logo" />
                </Link>
              </div>
              <div className="col-6">
                <b>Customize Here</b>
              </div>
            </div>
            {/* mobile menu navigation start */}
            <nav>
              <ul className="mobile-menu">
                <hr className="m-1" />
                <li className="menu-item-has-children">
                  <Link to="/">
                    <b>Home</b>
                  </Link>
                </li>
                <hr className="m-1" />
                <li className="menu-item-has-children">
                  <a
                    className={`d-flex align-items-center justify-content-between ${
                      isOpen ? "open" : ""
                    }`}
                    data-bs-toggle="collapse"
                    href="#collapseExample"
                    role="button"
                    aria-expanded={isOpen ? "true" : "false"}
                    aria-controls="collapseExample"
                    onClick={toggleDropdown}
                  >
                    <p className="d-flex align-items-center m-0">
                      <b>categories</b>
                    </p>
                    <i
                      className={`fa-solid fa-sort-down ${
                        isOpen ? "rotate" : ""
                      }`}
                    ></i>
                  </a>
                  <div className="category-collapse collapse" id="collapseExample">
                    <div className="card card-body">
                      <ul>
                        <div className="about-us-contents d-flex col-12 justify-content-start align-items-center p-0">
                          <div className="about-us-btn">
                            <Link className="btn mt-0" onClick={closeMenu} to="/allcategories">
                              All Categories
                            </Link>
                          </div>
                        </div>
                        {categories.map((cat, index) => (
                          <li key={index}>
                            <Link onClick={closeMenu} to={`/collections/${cat.slug}`}>
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
                <hr className="m-1" />
                <li className="menu-item-has-children">
                  <Link to={`/collections/allproducts`}>
                    <b>Store</b>
                  </Link>
                </li>
                <hr className="m-1" />
                <li className="menu-item-has-children">
                  <Link to="/about">
                    <b>About Us</b>
                  </Link>
                </li>
                <hr className="m-1" />
                <li className="menu-item-has-children">
                  <Link to="/contact">
                    <b>Contact Us</b>
                  </Link>
                </li>
                <hr className="m-1" />
                {/* <li className="menu-item-has-children">
                  <button className="btn col-12">
                    <Link
                      onClick={() =>
                        window.open(
                          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                          "_blank"
                        )
                      }
                    >
                      <i className=" bi bi-gift"></i> &nbsp; corporate gifts
                    </Link>
                  </button>
                </li> */}

                {/* Rest of the menu items */}
              </ul>
            </nav>
            {/* mobile menu navigation end */}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Mobilenav;
