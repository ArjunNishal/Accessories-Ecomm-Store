import { useState, useEffect } from "react";
import React from "react";
import { axiosInstance, token, renderUrl } from "../../../config";
import Addproducts from "./Addproducts";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, NavLink } from "react-router-dom";
import Singleproduct from "./Singleproduct";
import Editproduct from "./Editproduct";

const Productslist = () => {
  const token = localStorage.getItem("admin");
  const [activeTab, setActiveTab] = useState("pills-list");
  const [products, setProducts] = useState([]);
  const [productid, setproductid] = useState("");
  const [showproduct, setshowproduct] = useState(false);
  const [showEdit, setshowEdit] = useState(false);

  // sort
  const [sortOption, setSortOption] = useState("");

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Sort products based on the selected option
  const sortedProducts = () => {
    switch (sortOption) {
      case "priceHighToLow":
        return products.sort((a, b) => b.price - a.price);
      case "priceLowToHigh":
        return products.sort((a, b) => a.price - b.price);
      case "nameAZ":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case "nameZA":
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case "date":
        return products.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  };

  const sortedProductList = sortedProducts();

  const handleTabClick = (tabId) => {
    if (tabId === "pills-add") {
      closeproduct();
    }
    setActiveTab(tabId);
  };

  const getAllProducts = () => {
    axiosInstance
      .get("product/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle the response data
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const closeproduct = () => {
    setshowproduct(false);
    setshowEdit(false);
  };

  const gotoedit = () => {
    setshowEdit(true);
    setshowproduct(false);
  };

  const deleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`product/deleteproduct/${productId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            Swal.fire("Deleted!", "Product deleted successfully.", "success");
            console.log(response.data);
            getAllProducts();
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", "Failed to delete product.", "error");
          });
      } else {
        Swal.fire("Cancelled", "Product deletion canceled.", "info");
      }
    });
  };

  // pagination
  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProductList.slice(startIndex, endIndex);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h1 className="user-h1">
          <i className="fa-solid fa-pen-nib"></i> Manage Products
        </h1>
      </div>
      <ul
        className="adminNav nav  nav-tabs mb-3 pt-1 gap-3"
        id="pills-tab"
        role="tablist"
      >
        {showproduct || showEdit ? (
          <li className="productnav nav-item">
            <Link className="btn backbtn" onClick={closeproduct}>
              <i className="fa-solid fa-chevron-left"></i>
            </Link>
          </li>
        ) : (
          ""
        )}
        <li className="productnav nav-item">
          <a
            className={`productnav nav-link ${
              activeTab === "pills-list" ? "active" : ""
            }`}
            id="pills-home-tab"
            data-toggle="pill"
            href="#pills-home"
            role="tab"
            aria-controls="pills-list"
            aria-selected="true"
            onClick={() => handleTabClick("pills-list")}
          >
            Product List
          </a>
        </li>
        <li className="productnav nav-item">
          <a
            className={`productnav nav-link ${
              activeTab === "pills-add" ? "active" : ""
            }`}
            id="pills-profile-tab"
            data-toggle="pill"
            href="#pills-profile"
            role="tab"
            aria-controls="pills-add"
            aria-selected="false"
            onClick={() => handleTabClick("pills-add")}
          >
            ADD Product
          </a>
        </li>
        <li className="productnav nav-item">
          <a
            className={`productnav nav-link ${
              activeTab === "pills-add" ? "active" : ""
            }`}
            id="pills-profile-tab"
            data-toggle="pill"
            href="#pills-profile"
            role="tab"
            aria-controls="pills-add"
            aria-selected="false"
            onClick={() => handleTabClick("pills-add")}
          >
            ADD Product
          </a>
        </li>
      </ul>
      {/* 1. add product 2.product list 3. single product page 4.  */}

      <div className="tab-content productlist" id="pills-tabContent">
        <div
          className={`tab-pane fade show ${
            activeTab === "pills-list" ? "active" : ""
          }`}
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          {showproduct ? (
            <>
              <Singleproduct
                productid={productid}
                gotoedit={gotoedit}
                deleteProduct={deleteProduct}
              />
            </>
          ) : showEdit ? (
            <Editproduct
              getAllProducts={getAllProducts}
              productid={productid}
              closeproduct={closeproduct}
            />
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-end">
                <div>
                  <label className="form-label m-0" htmlFor="sort">
                    Sort By:&nbsp;
                  </label>
                </div>
                <div className="sort-container">
                  <select
                    id="sort"
                    className="form-select-sm"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="">Newest</option>
                    <option value="priceHighToLow">Price (High to Low)</option>
                    <option value="priceLowToHigh">Price (Low to High)</option>
                    <option value="nameAZ">Name (A-Z)</option>
                    <option value="nameZA">Name (Z-A)</option>
                    <option value="date">Old to New</option>
                  </select>
                </div>
              </div>
              <table className="table table-striped-columns">
                <thead className="table-dark text-center">
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={product._id} className="text-center">
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="new-arrivals-img-contnent">
                            <img
                              className="cardimg img-fluid"
                              src={`${renderUrl}uploads/products/${product.images[0]}`}
                              alt={product.name}
                            />
                          </div>
                        </div>
                      </td>
                      <td>{product.name}</td>
                      <td> ₹{product.price}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteProduct(product._id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          <Link
                            onClick={() => {
                              setproductid(product.slug);
                              setshowproduct(true);
                            }}
                            className="btn btn-success"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                          <Link
                            className="btn btn-primary"
                            onClick={() => {
                              setproductid(product.slug);
                              setshowEdit(true);
                            }}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center">
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({
                      length: Math.ceil(
                        sortedProductList.length / itemsPerPage
                      ),
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
                              onClick={() => handlePageChange(index + 1)}
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
                        currentPage ===
                        Math.ceil(sortedProductList.length / itemsPerPage)
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(sortedProductList.length / itemsPerPage)
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>
        <div
          className={`tab-pane fade show ${
            activeTab === "pills-add" ? "active" : ""
          }`}
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          <Addproducts getAllProducts={getAllProducts} />
        </div>
        <div
          className={`tab-pane fade show ${
            activeTab === "pills-add" ? "active" : ""
          }`}
          id="pills-contact2"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          <Addproducts getAllProducts={getAllProducts} />
        </div>
      </div>
    </div>
  );
};
export default Productslist;
