import React, { useState } from "react";
import { Link } from "react-router-dom";

const TestimonialSlider = () => {
  return (
    <div className="section-pb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title text-center">
              <h2>
                <span>Our Happy </span>Customers
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div
        id="carouselExampleCaptions"
        className="testimonial carousel slide "
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={0}
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={1}
            aria-label="Slide 2"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={2}
            aria-label="Slide 3"
          />
        </div>
        <div className="carousel-inner testimonial-carousel">
          <div className="carousel-item active">
            <div className="carousel-caption ">
              <div className="caption">
                <img src="assets/images/team/1.png" alt="" />
                <h5 className="mt-2">Mohit</h5>
                <p>
                  I've been ordering from Customize Here since an year & all the products are very authentic. The quality of items is amazing and comes on a very reasonable price.  
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-caption ">
              <div className="caption">
                <img src="assets/images/team/2.png" alt="" />
                <h5 className="mt-2">Sneha</h5>
                <p>
                  Customize Here is my one stop solution for all gift items. They've taken away all my thought process and worries for selecting gifts for my friends, family, relatives. Their products can really make someone's day.
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-caption ">
              <div className="caption">
                <img src="assets/images/team/1.png" alt="" />
                <h5 className="mt-2">Abhilash</h5>
                <p>
                  Product, Packaging, items, pricing, communication, delivery everything is on point. Lots to love to Customize Here, Looking forward to more of upcoming products range.
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
