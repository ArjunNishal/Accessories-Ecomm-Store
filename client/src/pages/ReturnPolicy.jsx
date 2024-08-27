import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ReturnPolicy = () => {
  return (
    <div>
      <Header />
      <div className="container p-5">
        <div className="ec-page-body">
          <h3>Return, Refund and Cancellation policy</h3>
          <hr />
          <div>
            <h4>How long is the order processing time?</h4>
            <p>
              It usually takes around 2-3 working days for processing the
              samples and then approximately 2-7 working days to deliver depends
              on your location.
            </p>
            <h4>
              <section>
                Tracking your Order
                <br />
              </section>
            </h4>
            <section>
              <div>
                <div>
                  <p>
                    We provide a courier partner tracking number and a tracking
                    link for your order which shows the current status.
                  </p>
                </div>
              </div>
            </section>
            <section>
              <div />
            </section>
            <h4>Return Policy</h4>
            <article>
              <section>
                <p>
                  At ‘Customize Here ’, we create products for you chosen
                  especially by you and so they are very dear to us. Since they
                  are exactly what you want, we create these from scratch. This
                  is the very reason that they cannot be exchanged or returned.
                  <br />
                  Products ordered may have a 5–7% variation in color due to
                  visual display of the screen. Also, these are handmade
                  products which may have a slight difference.
                </p>
                <div />
                <div>
                  <strong>
                    {" "}
                    We do not entertain order refund &amp; cancellation requests
                  </strong>
                </div>
                <p>
                  Customize Here not have a return or exchange policy. We might
                  request you to share <strong>PARCEL OPENING VIDEO </strong>of
                  your product for your order to qualify as an exchange.
                </p>
                <p>
                  You must raise a request by emailing us on{" "}
                  <strong>care.customizehere@gmail.com</strong> within 48 hours
                  of receipt of your order
                  <br />
                  Product packaging must not be tampered with. Product must be
                  in perfect condition
                  <br />
                  Exchange will be processed only once the product has been
                  received in our warehouse and has been checked for quality by
                  us.
                  <br />
                  Exchange will be processed for damaged or defective products
                  in the form of the same product and personalisation only.
                  Please note the shipping charges where applicable will not be
                  refunded. <br />
                  Once you have requested for an exchange the product will be
                  collected within 7 working days. If you choose to self-ship
                  the products, they should be dispatched within 48 hours after
                  the return request is raised and packed securely to prevent
                  any damage during transit.
                  <br />
                </p>
              </section>
            </article>
            <h1>
              <section>
                <div>
                  <div />
                </div>
              </section>
            </h1>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReturnPolicy;
