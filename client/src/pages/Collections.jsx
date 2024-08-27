import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import Slider from "rc-slider";
// import { Productlist } from "../components/Productlist";
import { useDispatch, useSelector } from "react-redux";
import { ADD, decQuantity, Removeitem } from "../redux/actions/action";
import "rc-slider/assets/index.css";
import { axiosInstance, renderUrl } from "../config";

const Collections = () => {
  const { name } = useParams("");
  const token = localStorage.getItem("token");
  const [id, setid] = useState("");
  const [catName, setCatName] = useState(name);
  useEffect(() => {
    fetchCategories();
    const fetchProductsByCategory = async () => {
      setproducts([]);
      setspinner(true);
      try {
        const response = await axiosInstance.get(`category/products/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(name, "name", catName);
        console.log(response);
        const fetchedProducts = response.data;
        setproducts(fetchedProducts);
        setspinner(false);
      } catch (error) {
        console.error(error);
        setspinner(false);
      }
    };

    fetchProductsByCategory();
  }, [name]);

  const [range, setRange] = useState([0, 5000]);

  const handleSliderChange = (value) => {
    setRange(value);
  };

  const [products, setproducts] = useState([]);

  const [showspinner, setspinner] = useState(false);
  // get categories
  const [categories, setCategories] = useState([]);
  const [selectedcategory, setselectedcategory] = useState("");
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
      console.log(name, "name2", catName);
      const selectedCategory = data.find((category) => category.slug === name);
      console.log("selectedCategory", selectedCategory);
      setselectedcategory(selectedCategory);
      setid(selectedCategory._id);
      const categoryname = data.find((cat) => cat.name === name);
      // const catname = categoryname.name;
      // console.log(categoryname, catname, "category name of the name");
      if (categoryname) {
        setcategory(categoryname);
        return;
      }
      setcategory("Collections");
      // console.log(selectedCategory, "selectedCategory");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  const [sortOption, setSortOption] = useState("relevance");

  // Function to handle the sort option change
  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedProducts = () => {
    switch (sortOption) {
      case "priceHighToLow":
        return products.sort((a, b) => b.price - a.price);
      case "priceLowToHigh":
        return products.sort((a, b) => a.price - b.price);
      default:
        return products;
    }
  };

  const sortedProductList = sortedProducts();

  // Function to filter the products based on the price range
  const filterProducts = () => {
    // Filter the products based on the selected price range
    const filteredProducts = sortedProductList.filter(
      (product) => product.discount >= range[0] && product.discount <= range[1]
    );

    return filteredProducts;
  };

  const filteredProductslist = filterProducts();

  // Function to handle min price change
  const handleMinPriceChange = (e) => {
    const newMinPrice = parseInt(e.target.value);
    setRange([newMinPrice, range[1]]);
  };

  // Function to handle max price change
  const handleMaxPriceChange = (e) => {
    if (e.target.value > 5000) {
      const newMaxPrice = 5000;
      setRange([range[0], newMaxPrice]);
    } else {
      const newMaxPrice = parseInt(e.target.value);
      setRange([range[0], newMaxPrice]);
    }
  };

  const [category, setcategory] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProductslist.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProductslist.length / productsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div>
      <Header />
      {/* breadcrumb-area start */}
      <div className="collection breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="breadcrumb-title">{selectedcategory.name}</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">{selectedcategory.name}</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}
      {/* main-content-wrap start */}
      <div className="main-content-wrap shop-page section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 order-lg-1 order-2">
              {/* shop-sidebar-wrap start */}
              <div className="shop-sidebar-wrap">
                {/* shop-sidebar start */}
                <div className="shop-sidebar mb-30 d-md-block d-none">
                  <h4 className="title">FILTER BY PRICE</h4>
                  {/* filter-price-content start */}
                  <div className="filter-price-content ">
                    <Slider
                      range
                      min={0}
                      max={5000}
                      value={range}
                      onChange={handleSliderChange}
                    />
                    <form action="#" method="post">
                      <div className="filter-price-wapper">
                        <span>Price:</span>
                        <div className="row">
                          <div className="range-input col-4">
                            <input
                              type="number"
                              className="col-12"
                              id="min-price"
                              value={range[0]}
                              onChange={handleMinPriceChange}
                            />
                          </div>
                          <span className="col-1">—</span>
                          <div className="range-input col-6">
                            <input
                              type="number"
                              className="col-12"
                              id="max-price"
                              value={range[1]}
                              onChange={handleMaxPriceChange}
                            />
                          </div>
                          {/* <Link className="add-to-cart-button" to="#">
                            <span>FILTER</span>
                          </Link> */}
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* filter-price-content end */}
                </div>
                {/* shop-sidebar end */}
                {/* shop-sidebar start */}
                <div className="shop-sidebar mb-30 d-md-block d-none">
                  <h4 className="title">CATEGORIES</h4>
                  <ul>
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <Link to={`/collections/${cat.slug}`}>
                          {cat.name}
                          {/* <span>(18)</span> */}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* shop-sidebar end */}
              </div>
              {/* shop-sidebar-wrap end */}
            </div>
            <div className="col-lg-9 order-lg-2 order-1">
              {/* shop-product-wrapper start */}
              <div className="shop-product-wrapper">
                <div className="row">
                  <div className="col">
                    {/* shop-top-bar start */}
                    <div className="shop-top-bar">
                      {/* product-view-mode start */}
                      <div className="product-mode">
                        {/*shop-item-filter-list*/}
                        <ul
                          className="nav shop-item-filter-list"
                          role="tablist"
                        >
                          <li className="active d-md-block d-none">
                            <Link
                              className="active"
                              data-bs-toggle="tab"
                              to="#grid"
                            >
                              <i className="ion-ios-keypad-outline" />
                            </Link>
                          </li>
                          <li className="d-md-block d-none">
                            <Link data-bs-toggle="tab" to="#list">
                              <i className="ion-ios-list-outline" />
                            </Link>
                          </li>
                        </ul>
                        {/* shop-item-filter-list end */}
                      </div>
                      {/* product-view-mode end */}
                      <h4>{selectedcategory.name}</h4>
                      {/* product-short start */}
                      <div>
                        <button
                          className="btn d-md-none d-block"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasExample"
                          aria-controls="offcanvasExample"
                        >
                          <i class="fa-solid fa-filter"></i>
                        </button>
                        <div
                          className="offcanvas offcanvas-start"
                          tabIndex={-1}
                          id="offcanvasExample"
                          aria-labelledby="offcanvasExampleLabel"
                        >
                          <div className="offcanvas-header">
                            <h5
                              className="offcanvas-title"
                              id="offcanvasExampleLabel"
                            >
                              <div className="row">
                                <img
                                  className="col-4"
                                  src="/assets/images/logo/logo.png"
                                  alt="logo"
                                />
                                <h4 className="col-8">Customize Here</h4>
                              </div>
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                            />
                          </div>
                          <div className="offcanvas-body">
                            <h4>Sort :</h4>
                            <div className="product-short">
                              <select
                                className="nice-select"
                                name="sortby"
                                value={sortOption}
                                onChange={handleSortOptionChange}
                              >
                                <option value="relevance">Relevance</option>
                                <option value="priceLowToHigh">
                                  Price (Low to High)
                                </option>
                                <option value="priceHighToLow">
                                  Price (High to Low)
                                </option>
                                {/* <option value="ratingLowest">Rating (Lowest)</option>
                          <option value="ratingHighest">
                            Rating (Highest)
                          </option> */}
                              </select>
                            </div>
                            <div className="shop-sidebar mb-30">
                              <hr />
                              <h4 className="title">FILTER BY PRICE</h4>
                              {/* filter-price-content start */}
                              <div className="filter-price-content">
                                <Slider
                                  range
                                  min={0}
                                  max={5000}
                                  value={range}
                                  onChange={handleSliderChange}
                                />
                                <form action="#" method="post">
                                  <div className="filter-price-wapper">
                                    <span>Price:</span>
                                    <div className="row">
                                      <div className="range-input col-3">
                                        <input
                                          type="number"
                                          className="col-12"
                                          id="min-price"
                                          value={range[0]}
                                          onChange={handleMinPriceChange}
                                        />
                                      </div>
                                      <span className="col-1">—</span>
                                      <div className="range-input col-6">
                                        <input
                                          type="number"
                                          className="col-12"
                                          id="max-price"
                                          value={range[1]}
                                          onChange={handleMaxPriceChange}
                                        />
                                      </div>
                                      {/* <Link className="add-to-cart-button" to="#">
                            <span>FILTER</span>
                          </Link> */}
                                    </div>
                                  </div>
                                </form>
                              </div>
                              {/* filter-price-content end */}
                            </div>
                            <div className="shop-sidebar mb-30">
                              <h4 className="title">CATEGORIES</h4>
                              <ul>
                                {categories.map((cat) => (
                                  <li key={cat._id}>
                                    <Link to={`/collections/${cat.slug}`}>
                                      {cat.name}
                                      {/* <span>(18)</span> */}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="product-short d-md-block d-none">
                        <select
                          className="nice-select"
                          name="sortby"
                          value={sortOption}
                          onChange={handleSortOptionChange}
                        >
                          <option value="relevance">Relevance</option>
                          <option value="priceLowToHigh">
                            Price (Low to High)
                          </option>
                          <option value="priceHighToLow">
                            Price (High to Low)
                          </option>
                          {/* <option value="ratingLowest">Rating (Lowest)</option>
                          <option value="ratingHighest">
                            Rating (Highest)
                          </option> */}
                        </select>
                      </div>
                      {/* product-short end */}
                    </div>
                    {/* shop-top-bar end */}
                  </div>
                </div>
                {/* shop-products-wrap start */}
                <div className="shop-products-wrap">
                  <div className="tab-content">
                    {showspinner ? (
                      <>
                        <div
                          className="spinner-border text-danger"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="tab-pane active" id="grid">
                          <div className="shop-product-wrap">
                            <div className="row">
                              {currentProducts.length > 0 ? (
                                <>
                                  {currentProducts.map((item) => (
                                    <div
                                      className="col-lg-4 col-md-4 col-6"
                                      key={item._id}
                                    >
                                      {/* single-product-wrap start */}
                                      <div className="single-product-wrap resp-product-wrap">
                                        <div className="product-image">
                                          <Link
                                            to={`/productpage/${item.slug}`}
                                          >
                                            <img
                                              src={`${renderUrl}uploads/products/${item.images[0]}`}
                                              alt="Produce Images"
                                            />
                                          </Link>
                                          {/* <span className="label">20% Off</span> */}
                                          <div className="product-action resp-product-action">
                                            <Link
                                              to={`/productpage/${item.slug}`}
                                              className="add-to-cart rounded"
                                            >
                                              <button className="btn">
                                                <i className="ion-ios-cart-outline"></i>{" "}
                                                Buy Now
                                              </button>
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="product-content">
                                          <h3>
                                            <Link
                                              to={`/productpage/${item.slug}`}
                                            >
                                              {item.name}
                                            </Link>
                                          </h3>
                                          <div className="price-box">
                                            <span className="old-price">
                                              ₹{item.price}
                                            </span>
                                            <span className="new-price">
                                              ₹{item.discount}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      {/* single-product-wrap end */}
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <>No products found</>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane" id="list">
                          <div className="shop-product-list-wrap">
                            {currentProducts.length > 0 ? (
                              <>
                                {currentProducts.map((item) => (
                                  <div
                                    className="row product-layout-list"
                                    key={item._id}
                                  >
                                    <div className="col-lg-4 col-md-5">
                                      {/* single-product-wrap start */}
                                      <div className="single-product-wrap">
                                        <div className="product-image">
                                          <Link
                                            to={`/productpage/${item.slug}`}
                                          >
                                            <img
                                              src={`${renderUrl}uploads/products/${item.images[0]}`}
                                              alt="Produce Images"
                                            />
                                          </Link>
                                          <span className="label">30% Off</span>
                                          <div className="product-action">
                                            <Link
                                              to={`/productpage/${item.slug}`}
                                              className="add-to-cart rounded"
                                            >
                                              <button className="btn">
                                                <i className="ion-ios-cart-outline"></i>{" "}
                                                Buy Now
                                              </button>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                      {/* single-product-wrap end */}
                                    </div>
                                    <div className="col-lg-8 col-md-7">
                                      <div className="product-content text-start">
                                        <h3>
                                          <Link
                                            to={`/productpage/${item.slug}`}
                                          >
                                            {item.name}
                                          </Link>
                                        </h3>
                                        <div className="price-box">
                                          <span className="old-price">
                                            ₹{item.price}
                                          </span>
                                          <span className="new-price">
                                            ₹{item.discount}
                                          </span>
                                        </div>
                                        <p>{item.detail}</p>
                                        <Link
                                          to={`/productpage/${item.slug}`}
                                          className="btn"
                                        >
                                          <i className="ion-bag" /> Shop Now
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <>No products found</>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* shop-products-wrap end */}
                {/* paginatoin-area start */}
                {currentProducts && (
                  <div className="paginatoin-area">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <ul className="pagination-box">
                          <li>
                            {/* Previous page button */}
                            <Link
                              className="Previous"
                              onClick={() =>
                                setCurrentPage((prevPage) =>
                                  prevPage > 1 ? prevPage - 1 : prevPage
                                )
                              }
                            >
                              <i className="ion-chevron-left" />
                            </Link>
                          </li>

                          {/* Render page numbers */}
                          {[...Array(totalPages)].map((_, index) => (
                            <li
                              key={index}
                              className={
                                currentPage === index + 1 ? "active" : ""
                              }
                            >
                              <Link onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                              </Link>
                            </li>
                          ))}

                          <li>
                            {/* Next page button */}
                            <Link
                              className="Next"
                              onClick={() =>
                                setCurrentPage((prevPage) =>
                                  prevPage < totalPages
                                    ? prevPage + 1
                                    : prevPage
                                )
                              }
                            >
                              <i className="ion-chevron-right" />{" "}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {/* paginatoin-area end */}
              </div>
              {/* shop-product-wrapper end */}
            </div>
          </div>
        </div>
      </div>
      {/* main-content-wrap end */}
      <Footer />
    </div>
  );
};

export default Collections;
