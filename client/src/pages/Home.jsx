import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import TestimonialSlider from "../components/TestimonialSlider";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { axiosInstance, renderUrl } from "../config";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD,
  decQuantity,
  Removeitem,
  clearCartAndUser,
} from "../redux/actions/action";
import ProductSlider from "../components/ProductSlider";

const Home = () => {
  const token = localStorage.getItem("token");
  const [highlightedproducts, sethighlightedproducts] = useState([]);
  // console.log(highlightedproducts, "highlightedproducts");
  const [Loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // fetch featured products
  const fetchHighlightedProducts = async () => {
    try {
      const response = await axiosInstance.get("product/highlighted", {
        onDownloadProgress: (progressEvent) => {
          const progressPercentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(progressPercentage);
        },
      });
      // console.log(response.data, "products");
      sethighlightedproducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch highlighted products:", error);
    }
  };

  useEffect(() => {
    fetchHighlightedProducts();
  }, []);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("category/view/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      // console.log(response);
      setCategories(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getdata = useSelector((state) => state.cartReducer.carts);
  // console.log(getdata, "state");
  const dispatch = useDispatch();

  const send = (item) => {
    // console.log(e);
    dispatch(ADD(item));
  };

  const isItemInCart = (itemId) => {
    if (getdata === null || getdata === undefined) {
      return false;
    }

    return getdata.some((el) => {
      // console.log(el._id === itemId,"el");
      return el._id === itemId;
    });
  };

  const [offers, setOffers] = useState({});
  const fetchOffers = async () => {
    try {
      const response = await axiosInstance.get("offer/view/offers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const offers = response.data;
      const latestoffer = offers.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      console.log(latestoffer[0]);
      setOffers(latestoffer[0]);
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message to the user
    }
  };
  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="main-wrapper">
      <Header />

      {/* <!-- Hero Section Start --> */}
      <Slider />

      {/* <!-- Hero Section End --> */}

      {/* <!-- Banner Area Start --> */}
      <div className="banner-area section-pt">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <h2>
                  <span>Top</span> Categories
                </h2>
                {/* <p>
                  
                </p> */}
              </div>
            </div>
          </div>
          <div className="row p-1 justify-content-center">
            {categories.slice(0, 6).map((cat, index) => {
              // console.log(cat,"category");
              return (
                <div key={index} className="col-lg-4 col-md-3 col-6">
                  {/* <!-- Single Banner Start --> */}
                  <div className="home single-banner mt-30 mb-30 my-10">
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        src={`${renderUrl}uploads/category/${cat.image}`}
                        alt={cat.name}
                      />
                    </div>
                    <div className="banner-head resp-head">
                      <div className=" banner-head-text resp-text d-flex justify-content-center align-items-center">
                        <h4 className="m-0 rounded">{cat.name}</h4>
                      </div>
                    </div>
                    <div className="banner-content d-flex justify-content-center align-items-center text-center">
                      <div className="banner-content-box ">
                        <h4>{cat.name}</h4>
                        {/* <p>
                       
                      </p> */}
                        <Link to={`/collections/${cat.slug}`}>
                          <button className="btn">Shop now</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Single Banner End --> */}
                </div>
              );
            })}
            <div className="about-us-contents d-flex col-12 justify-content-center align-items-center p-3">
              <div className="about-us-btn">
                <Link className="btn mt-0" to="/allcategories">
                  All Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Banner Area End --> */}

      {/* <!-- Start Product Area --> */}
      <div className="porduct-area section-pt section-pb-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <h2>
                  <span>Featured</span> Products
                </h2>
                {/* <p>
                  
                </p> */}
              </div>
            </div>
          </div>

          <div className="row product-active-lg-4">
            {highlightedproducts.slice(0, 4).map((item, index) => (
              <div className="col-md-3 col-6" key={index}>
                {/* <!-- single-product-wrap start --> */}
                <div className="single-product-wrap resp-product-wrap">
                  <div className="product-image">
                    <Link to={`/productpage/${item.slug}`}>
                      <img
                        src={`${renderUrl}uploads/products/${item.images[0]}`}
                        alt="Produce Images"
                      />
                    </Link>
                    {/* {offers.} */}
                    {/* <span className="label">30% Off</span> */}
                    <div className="product-action resp-product-action">
                      <Link
                        to={`/productpage/${item.slug}`}
                        className="add-to-cart rounded"
                      >
                        <button className="btn">
                          <i className="ion-ios-cart-outline"></i> Buy Now
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="product-content">
                    <h3>
                      <Link to={`/productpage/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <div className="price-box">
                      <span className="old-price">₹{item.price}</span>
                      <span className="new-price">₹{item.discount}</span>
                    </div>
                  </div>
                </div>
                {/* <!-- single-product-wrap end --> */}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <!-- Start Product End --> */}

      {/* <!-- Banner Area Start --> */}
      <div className="banner-area section-pb">
        <div className="container-fluid px-4">
          <div className="row ">
            <div className="col-lg-11 mx-auto col-md-12 mt-30">
              {/* <!-- Single Banner Start --> */}
              <div className="single-banner-two banner_bg-two">
                <div className="banner-content-two text-start">
                  <div className="banner-content-box">
                    {offers ? (
                      <h3>
                        <span>{offers?.name}</span> {offers?.description}
                      </h3>
                    ) : (
                      <>
                        <h3>
                          <span>30%</span> off on all products
                        </h3>
                        <h3></h3>
                      </>
                    )}

                    <Link to="/collections/allproducts">
                      <button className="btn">Shop now</button>
                    </Link>
                  </div>
                </div>
              </div>
              {/* <!-- Single Banner End --> */}
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Banner Area End --> */}

      {/* <!-- Start Product Area --> */}
      <div className="porduct-area section-pb pt-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <h2>
                  <span>Products</span>
                </h2>
                {/* <p>
                  
                </p> */}
              </div>
            </div>
          </div>

          <div className="row product-two-row-4">
            <>
              <ProductSlider />
            </>
          </div>
        </div>
      </div>
      {/* <div className="test-container container">
        <Testslider />
      </div> */}
      {/* <!-- Start Product End --> */}

      {/* <!-- testimonial-area start --> */}
      {/* <section className="container-fluid x-0"> */}
      <TestimonialSlider />
      {/* </section> */}
      {/* cta bottom */}
      <section className="bottom-cta d-xl-block d-none section-pb">
        <div className="container-fluid">
          <div className="d-flex justify-content-end">
            <div className="botton-cta-inner rounded m-5">
              <div className="row cta-contact rounded m-5">
                <div className="col-xl-6 col-12 p-5 cta-contact-inner mt-3 mb-3">
                  <div className="section-title">
                    <h2>
                      <span>Contact</span> Us
                    </h2>
                    <p>Share your query, experience , ideas with us.</p>
                  </div>
                  <button className="btn p-2">
                    <Link to={"/contact"}>Contact Us</Link>
                  </button>
                </div>
                <div className="col-xl-6 col-12 p-5 cta-contact-inner mt-3 mb-3">
                  <div className="section-title">
                    <h2>Corporate gifts</h2>
                    <p>We're launching Corporate Gifts soon!!</p>
                    {/* <p>Checkout our amazing range for corporate gifting</p> */}
                  </div>
                  {/* <button className="addtocart  border-outline-lite rounded p-2">
                    <Link
                      onClick={() =>
                        window.open(
                          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                          "_blank"
                        )
                      }
                      className="text-white"
                      to={``}
                    >
                      Corporate Gifts
                    </Link>
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bottom-cta d-xl-none d-block">
        <div>
          <div className="botton-cta-inner-2 rounded ">
            <div className="row cta-contact-2 rounded border m-5">
              <div className="col-md-6 col-12 p-5 cta-contact-inner mt-3 mb-3">
                <div className="section-title">
                  <h2>
                    <span>Contact</span> Us
                  </h2>
                  <p>Share your query, experience , ideas with us.</p>
                </div>
                <button className="btn p-2">
                  <Link to={"/contact"}>Contact Us</Link>
                </button>
              </div>
              <div className="col-md-6 col-12 p-5 cta-contact-inner mt-3 mb-3">
                <div className="section-title">
                  <h2>Corporate gifts</h2>
                  <p>We're launching Corporate Gifts soon!!</p>
                </div>
                {/* <button className="addtocart  border-outline-lite rounded p-2">
                  <Link
                    onClick={() =>
                      window.open(
                        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                        "_blank"
                      )
                    }
                    className="text-white"
                    to={``}
                  >
                    Corporate Gifts
                  </Link>
                </button> */}
              </div>
            </div>
            <div className="cta-back d-sm-none d-block"></div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
// {categories.slice(0, 10).map((item, index) => (
//   <div className="col-lg-3" key={index}>
//     {/* <!-- single-product-wrap start --> */}
//     <div className="single-product-wrap">
//       <div className="product-image">
//         <Link to={`/collections/${item._id}`}>
//           <img
//             // src={`${renderUrl}uploads/products/${item.image}`}
//             src="assets/images/product/1.jpg"
//             alt={item.image}
//           />
//         </Link>
//         {/* <span className="label">30% Off</span> */}
//         {/* <div className="product-action">
//             {isItemInCart(item._id) ? (
//               ""
//             ) : (
//               <Link
//                 to="#"
//                 onClick={() => {
//                   console.log("send home1");
//                   send(item);
//                 }}
//                 className="add-to-cart rounded"
//               >
//                 <button className="btn">
//                   <i className="ion-ios-cart-outline"></i> Add to
//                   Cart
//                 </button>
//               </Link>
//             )}
//           </div> */}
//       </div>
//       <div className="product-content">
//         <h3 className="text-capitalize">
//           <Link to={`/collections/${item._id}`}>{item.name}</Link>
//         </h3>
//         {/* <div className="price-box">
//             <span className="old-price">₹{item.price}</span>
//             <span className="new-price">₹{item.price}</span>
//           </div> */}
//       </div>
//     </div>
//     {/* <!-- single-product-wrap end --> */}
//   </div>
// ))}

// let images = ['photoFromInternet', 'photoFromInternet2', 'photoFromInternet3'];
