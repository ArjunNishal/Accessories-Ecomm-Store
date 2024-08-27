import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { axiosInstance, renderUrl } from "../config";

const Allcategories = () => {
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
      console.log(response);
      setCategories(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div>
      <Header />
      <div className="collection breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="breadcrumb-title">All Categories</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">All Categories</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="banner-area section-pt">
          <div className="">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center">
                  <h2>
                    <span>All</span> Categories
                  </h2>
                  {/* <p>
                    
                  </p> */}
                </div>
              </div>
            </div>
            <div className="row p-1">
              {categories.map((cat, index) => (
                <div key={index} className=" col-lg-4 col-md-3 col-6">
                  {/* <!-- Single Banner Start --> */}
                  <div className="allcat respcat single-banner my-10 mt-30 mb-30">
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        src={`${renderUrl}uploads/category/${cat.image}`}
                        alt={cat.name}
                      />
                    </div>
                    <div className="banner-head  resp-head">
                      <div className=" banner-head-text resp-text d-flex justify-content-center align-items-center">
                        <h4 className="m-0 rounded">{cat.name}</h4>
                      </div>
                    </div>
                    <div className="banner-content d-flex justify-content-center text-center">
                      <div className="banner-content-box text-center">
                        <h4>{cat.name}</h4>
                        <Link to={`/collections/${cat.slug}`}>
                          <button className="btn">Shop now</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Single Banner End --> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Allcategories;
