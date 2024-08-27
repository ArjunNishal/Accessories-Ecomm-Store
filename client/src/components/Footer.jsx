import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import freedelivery from "../components/freedelivery.json";
import { axiosInstance } from "../config";

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const SubscribeToNewsletter = async () => {
    try {
      console.log(subscribeEmail, token);
      const response = await axiosInstance.post("cart/subscribe", {subscribeEmail}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setFormMessage("Subscribed!!");
      setSubscribeEmail("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <footer>
      <div className="footer-top section-pb section-pt-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="widget-footer mt-20">
                <div className="footer-logo">
                  <Link to="/">
                    <img src="/assets/images/logo/logo.png" alt="logo" />
                  </Link>
                </div>
                <h4 className="text-white">Subscribe to our newsletter</h4>
                <div className="newsletter-footer">
                  <input type="text" className="text-white" value={subscribeEmail} placeholder="You Email" id="subscriber-email" onChange={(e) => setSubscribeEmail(e.target.value)} />
                  <div className="subscribe-button">
                    <button className="subscribe-btn" onClick={() => {SubscribeToNewsletter()}}>Subscribe</button>
                    <p className="form-messege">{formMessage}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="widget-footer mt-30">
                <h6 className="title-widget">QUICK LINK</h6>
                <ul className="footer-list">
                  {/* <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li> */}
                  <li>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/return-policy">
                      Return, refund & Cancellation Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-and-conditions">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to="/Shipping-and-PaymentInfo">
                      Shipping and Payment Info
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="widget-footer mt-30">
                <h6 className="title-widget">QUICK CONTACT</h6>
                <ul className="footer-contact">
                  <li>
                    <label>Phone</label>
                    <Link to="#">+91 9188363339</Link>
                  </li>
                  <li>
                    <label>Email</label>
                    <Link to="#"> care.customizehere@gmail.com</Link>
                  </li>
                  <li>
                    <label>Address</label>
                    24/488 Kalmandapam Palakkad, <br /> Kerala, India
                  </li>
                </ul>
              </div>
            </div>
            {/* <div className="col-lg-3 col-md-6">
              <div className="widget-footer mt-30">
                <h6 className="title-widget">LATEST BLOG</h6>
                <ul className="footer-blog">
                  <li>
                    <div className="widget-blog-wrap">
                      <div className="widget-blog-image">
                        <Link to="#">
                          <img src="/assets/images/product/2.jpg" alt="" />
                        </Link>
                      </div>
                      <div className="widget-blog-content">
                        <h6>
                          <Link to="#">
                            Some patience for the modern market
                          </Link>
                        </h6>
                        <div className="widget-blog-meta">
                          <span>21 Aug 2019</span>{" "}
                          <span>
                            By <Link to="#">Admin</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="widget-blog-wrap">
                      <div className="widget-blog-image">
                        <Link to="#">
                          <img src="/assets/images/product/1.jpg" alt="" />
                        </Link>
                      </div>
                      <div className="widget-blog-content">
                        <h6>
                          <Link to="#">
                            Modern market Some patience for the{" "}
                          </Link>
                        </h6>
                        <div className="widget-blog-meta">
                          <span>13 Aug 2019</span>{" "}
                          <span>
                            By <Link to="#">Admin</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
          {showScrollButton && (
            <div
              className="scroll-to-top fixed-bottom-right"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Lottie animationData={freedelivery} loop={true} />
            </div>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="copy-right-text text-center">
                <p>
                  Copyright &copy;{" "} Customizehere || <span className="text-danger">Powered by&nbsp;
                  <Link to="https://intoggle.com/">Intoggle</Link></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
