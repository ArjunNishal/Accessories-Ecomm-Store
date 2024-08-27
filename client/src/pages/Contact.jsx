import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { axiosInstance } from "../config";

const Contact = () => {
  // contact us form
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("body");
      const formData = {
        name,
        email,
        phone,
        message,
      };

      const response = await axiosInstance.post("cart/contactus", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setFormMessage("Email sent successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header />
      {/* breadcrumb-area start */}
      <div className="contact breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="breadcrumb-title">Contact Us</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Contact Us</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}
      {/* Page Conttent */}
      <main className="page-content section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-sm-12">
              <div className="contact-form">
                <div className="contact-form-info">
                  <div className="contact-title">
                    <h3>Share your Queries here</h3>
                  </div>
                  <form  onSubmit={handleSubmit}>
                    <div className="contact-page-form">
                      <div className="contact-input">
                        <div className="contact-inner">
                          <input
                            name="con_name"
                            type="text"
                            placeholder="Name *"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="contact-inner">
                          <input
                            name="con_phone"
                            type="text"
                            placeholder="Phone *"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            required
                          />
                        </div>
                        <div className="contact-inner w-100">
                          <input
                            name="con_email"
                            type="email"
                            placeholder="Email *"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                          />
                        </div>

                        <div className="contact-inner contact-message">
                          <textarea
                            name="con_message"
                            placeholder="Message *"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="contact-submit-btn">
                        <button className="submit-btn col-12" type="submit">
                          Send Email
                        </button>
                        <p className="form-messege">{formMessage}</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-sm-12">
              <div className="contact-infor">
                <div className="contact-title">
                  <h3>CONTACT US</h3>
                </div>
                <div className="contact-dec">
                  <p>
                    Unleash your creativity with our custom-made products. From
                    personalized wallets to unique pens and diaries, we bring
                    your ideas to life. Contact us today and let us craft the
                    perfect accessory that reflects your individuality.
                  </p>
                </div>
                <div className="contact-address">
                  <ul>
                    <li>
                    <i class="fa-solid fa-location-dot text-dark"></i> Address : 24/488
                      Kalmandapam Palakkad, Kerala, India
                    </li>
                    <li>
                    <i class="fa-regular fa-envelope text-dark"></i> care.customizehere@gmail.com
                    </li>
                    <li>
                    <i class="fa-solid fa-phone text-dark"></i> +91 9188363339
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/*// Page Conttent */}
      <Footer />
    </div>
  );
};

export default Contact;
