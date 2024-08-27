import React, { useEffect, useState } from "react";
import { axiosInstance, renderUrl } from "../config";
import { Link } from "react-router-dom";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevproduct, setPrevProduct] = useState({});
  const [nextproduct, setNextProduct] = useState({});

  const getAllProducts = async () => {
    try {
      const response = await axiosInstance.get("product/products");
      setProducts(response.data);
      console.log(response.data, "response.data");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    const prevIndex = activeIndex === 0 ? products.length - 1 : activeIndex - 1;
    const nextIndex = activeIndex === products.length - 1 ? 0 : activeIndex + 1;
    setPrevProduct(products[prevIndex]);
    setNextProduct(products[nextIndex]);
    // console.log(prevproduct.name, "product prev", nextproduct.name, "products");
  }, [activeIndex, products]);

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex === products.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
  };

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? products.length - 1 : prevIndex - 1;
      return newIndex;
    });
  };

  let timeout;

  useEffect(() => {
    timeout = setTimeout(goToNextSlide, 3000);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  return (
    <div style={{ position: "relative" }}>
      <div
        id="carouselExampleAutoplaying"
        className="product carousel slide "
        data-bs-ride="carousel"
      >
        <div className="banner carousel-inner">
          {products.map((product, index) => (
            <div
              className={`banner-item carousel-item ${
                index === activeIndex ? "active" : ""
              }`}
              key={index}
            >
              <img
                src={`${renderUrl}uploads/products/${product.images[0]}`}
                className="d-block w-100 d-md"
                alt={product.images[0]}
              />
              <div className="banner-info rounded p-3">
                <div className="row justify-content-center ">
                  <p className="text-center pb-0 mb-0">{product.name}</p>
                  <div className="d-flex justify-content-center">
                  <p className="">
                    <strike className="text-muted">₹{product.price}.00</strike>
                  </p>
                  {/* <p className="col-6 m-0 text-start">sold (179)</p> */}
                  <p className="ps-2">₹{product.discount}.00</p>
                  </div>

                  <button className="addtocart  border-outline-lite rounded col-12 p-1">
                    <Link
                      className="text-white"
                      to={`/productpage/${product.slug}`}
                    >
                      Buy Now{" "}
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
          onClick={goToPrevSlide}
        >
          <i className="ion-ios-arrow-thin-left"></i>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
          onClick={goToNextSlide}
        >
          <i className="ion-ios-arrow-thin-right"></i>
        </button>
      </div>
      <div className="sideimages d-md-block d-none">
        <div className="container">
          <div className="sideimages-row row justify-content-center align-items-center">
            <div className="col-2 sideimages-images">
              {prevproduct &&
                prevproduct.images &&
                prevproduct.images.length > 0 && (
                  <img
                    src={`${renderUrl}uploads/products/${prevproduct.images[0]}`}
                    alt={prevproduct.images[0]}
                  />
                )}
            </div>
            <div className="col-4"></div>
            <div className="col-2 sideimages-images">
              {nextproduct &&
                nextproduct.images &&
                nextproduct.images.length > 0 && (
                  <img
                    src={`${renderUrl}uploads/products/${nextproduct.images[0]}`}
                    alt={nextproduct.images[0]}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
      <div
        id="carouselExampleAutoplaying"
        className="mobile-product carousel slide d-none"
        data-bs-ride="carousel"
      >
        <div className="banner carousel-inner">
          {products.map((product, index) => (
            <div
              className={`banner-item carousel-item ${
                index === activeIndex ? "active" : ""
              }`}
              key={index}
            >
              <img
                src={`${renderUrl}uploads/products/${product.images[0]}`}
                className="d-block w-100 d-md"
                alt={product.images[0]}
              />
              <div className="banner-info p-1">
                <div className="row justify-content-center justify-content-around p-1 rounded">
                  <p className="text-center pb-0 mb-0">{product.name}</p>
                  <div className="d-flex justify-content-center">
                  <p className="">
                    <strike className="text-muted">₹{product.price}.00</strike>
                  </p>
                  {/* <p className="col-6 m-0 text-start">sold (179)</p> */}
                  <p className="ps-2">₹{product.discount}.00</p>
                  </div>

                  <button className="addtocart  border-outline-lite rounded col-5 offset-md-1 p-1">
                    <Link
                      className="text-white"
                      to={`/productpage/${product.slug}`}
                    >
                      Shop Now
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
          onClick={goToPrevSlide}
        >
          <i className="ion-ios-arrow-thin-left"></i>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
          onClick={goToNextSlide}
        >
          <i className="ion-ios-arrow-thin-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ProductSlider;
