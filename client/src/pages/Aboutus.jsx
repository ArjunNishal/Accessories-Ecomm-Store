import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TestimonialSlider from "../components/TestimonialSlider";
import { Link } from "react-router-dom";

const Aboutus = () => {
  return (
    <div>
      <Header />

      {/* breadcrumb-area start */}
      <div className="about breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="breadcrumb-title">About Us</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">About</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}
      {/* main-content-wrap start */}
      <div className="main-content-wrap">
        {/* About Us Area */}
        <div className="about-us-area section-ptb">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="about-us-contents">
                  <h3>
                    Welcome To <span>Customize Here</span>
                  </h3>
                  <p>
                    A revolutionary zero-investment startup founded by Sanin
                    Fariz. Our focus is on offering a diverse range of
                    personalized products that cater to unique preferences. At
                    Customize Here, we believe in more than just trading
                    merchandise; we're here to encapsulate emotions and forge a
                    special connection with our customers.
                  </p>

                  <h4>Our Personalized Touch</h4>
                  <p>
                    We meticulously curate a variety of customized items,
                    creating a personal resonance with our customers. Witness
                    the joy on our customers' faces as they receive creations
                    tailored to their desires and requirements.
                  </p>
                  <div className="about-us-btn">
                    <Link to="/collections/allproducts">Shop now</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 ">
                <div className="about-us-image text-right">
                  <img src="assets/images/product/10.jpg" alt="img" />
                </div>
              </div>
              <div className="col-12 py-5">
                <h4>
                  Guiding Principle - "Customised Products at Competitive Price
                  Range"
                </h4>
                <p>
                  With an infinite range of design and customization
                  possibilities, we transcend limits to bring your ideas to
                  life. Our primary product line features Customized wallet for
                  men, Customised wallet gift, Customised water bottle, and
                  Customised passport cover. However, we go beyond to offer a
                  diverse range, including customised t-shirts, corporate
                  combos, Men's kada , Kaapu , bracelet, wood engraving, and
                  corporate gifts.
                </p>
                <h4>Customer Loyalty and Growth</h4>
                <p>
                  Our success lies in customers consistently returning for their
                  gifting and customized product needs. This loyalty has led to
                  our diversification, proudly offering over 60 unique items.
                  From humble beginnings, we've become one of the foremost
                  leather engravers in the nation.
                </p>
                {/* <h4>Our Personalized Touch</h4> */}
                <p>
                  Website:{" "}
                  <a className="text-danger" href="https://customizehere.in/">
                    Customizehere.in
                  </a>
                </p>
                <p>
                  Discover the transformative power of customization with
                  Customize Here – where every product becomes a canvas for
                  emotions and individuality. Join us on this exciting journey
                  of crafting personalized experiences that leave a lasting
                  smile on your face. Explore our offerings, including Gift for
                  men, Anniversary gifts, Personalized gifts, Christmas gift
                  ideas, Gift ideas, Gifts for him, Gift shop, Anniversary
                  quotes,Gift ideas for women, Gift ideas for secret Santa and
                  Gifts for boyfriend.
                </p>
                {/* <h4>Our Personalized Touch</h4> */}
                <p>
                  Embark on a personalized journey with us, as we redefine
                  gifting and customization. Customize Here is not just a brand;
                  it's an experience, and we invite you to be a part of it.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/*// About Us Area */}
        {/* Project Count Area Start */}
        <div className="project-count-area section-pb section-pt-60 project-count-bg">
          <div className="container">
            <div className="project-count-inner_two">
              <div className="row">
                <div className="col-lg-12 ml-auto mr-auto">
                  <div className="row">
                    <div className="col-lg-3 col-sm-6">
                      <div className="single-fun-factor">
                        {/* counter start */}
                        <div className="counter text-center">
                          <h3>
                            <span className="counter-active">12,000</span>+
                          </h3>
                          <p>Orders Done</p>
                        </div>
                        {/* counter end */}
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                      <div className="single-fun-factor">
                        {/* counter start */}
                        <div className="counter text-center">
                          <h3>
                            <span className="counter-active">100</span>+
                          </h3>
                          <p>Products</p>
                        </div>
                        {/* counter end */}
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                      <div className="single-fun-factor">
                        {/* counter start */}
                        <div className="counter text-center">
                          <h3>
                            <span className="counter-active">20,000</span>+
                          </h3>
                          <p>Products Sold</p>
                        </div>
                        {/* counter end */}
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                      <div className="single-fun-factor">
                        {/* counter start */}
                        <div className="counter text-center">
                          <h3>
                            <span className="counter-active">10,000</span>+
                          </h3>
                          <p>Happy Customers</p>
                        </div>
                        {/* counter end */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Project Count Area End */}
        {/* Our Team Area */}
        {/* <div className="our-team-area section-ptb">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <div className="single-team mt--30">
                  <div className="single-team-image">
                    <img src="assets/images/team/team-01.webp" alt="img" />
                  </div>
                  <div className="single-team-info">
                    <h5>Arthur Lopez</h5>
                    <p>Designer</p>
                  </div>
                  <ul className="personsl-socail">
                    <li>
                      <Link to="#">
                        <i className="ion-social-facebook" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-twitter" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-tumblr" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-googleplus" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="single-team mt--30">
                  <div className="single-team-image">
                    <img src="assets/images/team/team-02.webp" alt="img" />
                  </div>
                  <div className="single-team-info">
                    <h5>Arthur Lopez</h5>
                    <p>Designer</p>
                  </div>
                  <ul className="personsl-socail">
                    <li>
                      <Link to="#">
                        <i className="ion-social-facebook" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-twitter" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-tumblr" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-googleplus" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="single-team mt--30">
                  <div className="single-team-image">
                    <img src="assets/images/team/team-03.webp" alt="img" />
                  </div>
                  <div className="single-team-info">
                    <h5>Robert Stewart</h5>
                    <p>Developer</p>
                  </div>
                  <ul className="personsl-socail">
                    <li>
                      <Link to="#">
                        <i className="ion-social-facebook" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-twitter" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-tumblr" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-googleplus" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="single-team mt--30">
                  <div className="single-team-image">
                    <img src="assets/images/team/team-04.webp" alt="img" />
                  </div>
                  <div className="single-team-info">
                    <h5>Developer</h5>
                    <p>Mark Howard</p>
                  </div>
                  <ul className="personsl-socail">
                    <li>
                      <Link to="#">
                        <i className="ion-social-facebook" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-twitter" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-tumblr" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ion-social-googleplus" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/*// Our Team Area */}
        {/* testimonial-area start */}
        {/* <TestimonialSlider /> */}
        {/* testimonial-area end */}
      </div>
      <section className="bottom-cta d-xl-block d-none">
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
                <button className="btn">Contact Us</button>
              </div>
              <div className="col-md-6 col-12 p-5 cta-contact-inner mt-3 mb-3">
                <div className="section-title">
                  <h2>Corporate gifts</h2>
                  <p>Checkout our amazing range for corporate gifting</p>
                </div>
                <button className="btn">Contact Us</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* main-content-wrap end */}
      <Footer />
    </div>
  );
};

export default Aboutus;
