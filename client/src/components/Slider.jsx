import React from "react";
import { Link } from "react-router-dom";

const Slider = () => {
  return (
    <div>
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="banner carousel-inner">
          <div className="banner-item carousel-item active">
            <img
              src="/assets/images/banner/1.jpg"
              className="d-none w-100 d-md-block "
              alt="banner image"
            />
            <img
              src="/assets/images/banner/18.jpg"
              className="d-block w-100 d-md "
              alt="banner image"
            />
            {/* <div className="corporate-gifts-wrap d-md-block d-none rounded">
              <button className="btn corporate-gifts">
                <Link
                  className="d-md-block d-none"
                  onClick={() =>
                    window.open(
                      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                      "_blank"
                    )
                  }
                >
                  <i className="intoggle-icons bi bi-gift"></i>&nbsp;corporate
                  gifts
                </Link>
              </button>
            </div>
            <div className="corporate-gifts-wrap-mobile d-md-none d-block rounded">
              <button className="btn corporate-gifts">
                <Link
                  className="d-md-none d-block"
                  onClick={() =>
                    window.open(
                      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                      "_blank"
                    )
                  }
                >
                  <i className="intoggle-icons bi bi-gift"></i>&nbsp;corporate
                  gifts
                </Link>
              </button>
            </div> */}
          </div>
          <div className="banner-item carousel-item">
            <img
              src="/assets/images/banner/2.jpg"
              className="d-none w-100 d-md-block "
              alt="banner image"
            />
            <img
              src="/assets/images/banner/19.jpg"
              className="d-block w-100 d-md "
              alt="banner image"
            />
             {/* <div className="corporate-gifts-wrap d-md-block d-none rounded">
              <button className="btn corporate-gifts">
                <Link
                  className="d-md-block d-none"
                  onClick={() =>
                    window.open(
                      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                      "_blank"
                    )
                  }
                >
                  <i className="intoggle-icons bi bi-gift"></i>&nbsp;corporate
                  gifts
                </Link>
              </button>
            </div>
            <div className="corporate-gifts-wrap-mobile d-md-none d-block rounded">
              <button className="btn corporate-gifts">
                <Link
                  className="d-md-none d-block"
                  onClick={() =>
                    window.open(
                      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                      "_blank"
                    )
                  }
                >
                  <i className="intoggle-icons bi bi-gift"></i>&nbsp;corporate
                  gifts
                </Link>
              </button>
            </div> */}
          </div>
          <div className="banner-item carousel-item">
            <img
              src="/assets/images/banner/3.jpg"
              className="d-none w-100 d-md-block "
              alt="banner image"
            />
            <img
              src="/assets/images/banner/20.jpg"
              className="d-block w-100 d-md "
              alt="banner image"
            />
            {/* <div className="corporate-gifts-wrap d-md-block d-none rounded">
              <button className="btn corporate-gifts">
                <Link
                  className="d-md-block d-none"
                  onClick={() =>
                    window.open(
                      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                      "_blank"
                    )
                  }
                >
                  <i className="intoggle-icons bi bi-gift"></i>&nbsp;corporate
                  gifts
                </Link>
              </button>
            </div>
            <div className="corporate-gifts-wrap-mobile d-md-none d-block rounded">
              <button className="btn corporate-gifts">
                <Link
                  className="d-md-none d-block"
                  onClick={() =>
                    window.open(
                      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                      "_blank"
                    )
                  }
                >
                  <i className="intoggle-icons bi bi-gift"></i>&nbsp;corporate
                  gifts
                </Link>
              </button>
            </div> */}
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          {/* <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span> */}
          <i className="ion-ios-arrow-thin-left"></i>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          {/* <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span> */}
          <i className="ion-ios-arrow-thin-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Slider;

// {/* <div className="hero-slider hero-slider-two">
//         {/* <!-- Single Slide Start --> */}
//         <div
//           className="single-slide-two"
//           style={{
//             backgroundImage: "url(assets/images/slider/slider-bg-two-01.jpg)",
//           }}
//         >
//           {/* <!-- Hero Content One Start --> */}
//           <div className="hero-content-one container">
//             <div className="row">
//               <div className="col-lg-10 col-md-10">
//                 <div className="slider-text-info">
//                   <h2>
//                     A <span>Different</span>{" "}
//                   </h2>
//                   <h1>
//                     Online <span>Flower</span> Shop{" "}
//                   </h1>
//                   <p>
//                    
//                   </p>
//                   <div className="hero-btn">
//                     <Link to="/collections" className="slider-btn-two uppercase">
//                       <span>SHOP NOW</span>
//                     </Link>
//                   </div>
//                   <div className="social-top">
//                     <ul>
//                       <li>
//                         <Link to="#">
//                           <i className="ion-social-facebook"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#">
//                           <i className="ion-social-twitter"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#">
//                           <i className="ion-social-tumblr"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#">
//                           <i className="ion-social-googleplus"></i>
//                         </Link>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* <!-- Hero Content One End --> */}
//         </div>
//         {/* <!-- Single Slide End --> */}

//         {/* <!-- Single Slide Start --> */}
//         <div
//           className="single-slide-two"
//           style={{
//             backgroundImage: "url(assets/images/slider/slide-bg-2.jpg)",
//           }}
//         >
//           {/* <!-- Hero Content One Start --> */}
//           <div className="hero-content-one container">
//             <div className="row">
//               <div className="col-lg-10 col-md-10">
//                 <div className="slider-text-info">
//                   <h2>
//                     A <span>Different</span>{" "}
//                   </h2>
//                   <h1>
//                     Online <span>Flower</span> Shop{" "}
//                   </h1>
//                   <p>
//                     
//                   </p>
//                   <div className="hero-btn">
//                     <Link to="/collections" className="slider-btn-two uppercase">
//                       <span>SHOP NOW</span>
//                     </Link>
//                   </div>
//                   <div className="social-top">
//                     <ul>
//                       <li>
//                         <Link to="#">
//                           <i className="ion-social-facebook"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#">
//                           <i className="ion-social-twitter"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#">
//                           <i className="ion-social-tumblr"></i>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="#">
//                           <i className="ion-social-googleplus"></i>
//                         </Link>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* <!-- Hero Content One End --> */}
//         </div>
//         {/* <!-- Single Slide End --> */}
//       </div> */}
