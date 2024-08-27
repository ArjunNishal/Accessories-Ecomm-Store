import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ShippingandPaymentInfo = () => {
  return (
    <div>
      <Header />
      <div className="container p-5">
        <div className="ec-page-title">
          <h3 className="page-title__name ec-header-h1">
            Shipping &amp; Payment Info
          </h3>
        </div>
        <hr />

        <div className="ec-page-body">
          <div>
            <p>
              Customize Here is currently shipping in India. There could be a
              possible delay in delivery of order due to the current situation.
              Regret this inconvenience.
            </p>
            <p>
              Once the order is dispatched, it would be delivered within 4-7
              working days.
            </p>
            <p>
              Please Note- During festivals, adverse weather conditions or
              political crises, your shipment could get further delayed in such
              cases, Customize Here will ensure delivery in the earliest
              possible time frame.
            </p>
            <p>
              If the order gets returned to us due to customer unavailable or
              incorrect address, the customer has to pay the charges for
              reshipping the order to Customize Here
            </p>
            <p>
              If the POD copy provided by the shipping company states the
              customer name on it, The Customize Here is not responsible for any
              claims made for not receiving the product by the customer.
            </p>
            <ol>
              <li>
                The date of delivery is provisional as it is shipped through
                third party courier partners.
              </li>
              <li>
                We try to get the gift delivered close to the provided date.
                However, your gift may be delivered prior or after the selected
                date of delivery.
              </li>
              <li>
                To maintain the element of surprise on gift arrival, our courier
                partners do not call prior to delivering an order, so we request
                that you provide an address at which someone will be present to
                receive the package.
              </li>
              <li>
                Delivery may not be possible on Sundays and National Holidays.
              </li>
            </ol>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingandPaymentInfo;
