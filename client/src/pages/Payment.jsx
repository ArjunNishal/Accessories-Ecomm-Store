import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import { axiosInstance } from "../config";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51NPirUSGPN3Ia4GzDp4ettFjgq0y46hvVyvRUSNtYbR4FloXp46UBwAVjAkN91LtSWrQS9nGwmlMHnbQHLpumnDB00fmdvs80e"
);

const Payment = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const itemsJson = searchParams.get("items");
  const items = JSON.parse(itemsJson);

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axiosInstance
      .post("payment/gateway", { items: items })
      .then((response) => {
        console.log(response);
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
