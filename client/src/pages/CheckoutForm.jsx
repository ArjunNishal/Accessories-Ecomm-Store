// import React, { useEffect, useState } from "react";
// import {
//   PaymentElement,
//   LinkAuthenticationElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { useNavigate } from "react-router-dom";

// export default function CheckoutForm(props) {
//   const { formData } = props;
//   const stripe = useStripe();
//   const elements = useElements();
//   // console.log(stripe, elements, "props");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate("");

//   useEffect(() => {
//     if (!stripe) {
//       return;
//     }

//     const clientSecret = new URLSearchParams(window.location.search).get(
//       "payment_intent_client_secret"
//     );
//     console.log(clientSecret, stripe);
//     if (!clientSecret) {
//       return;
//     }

//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       switch (paymentIntent.status) {
      
//         case "processing":
//           setMessage("Your payment is processing.");
//           break;
//           case "succeeded":
//             setMessage("Payment succeeded!");
//             break;
//         case "requires_payment_method":
//           setMessage("Your payment was not successful, please try again.");
//           break;
//         default:
//           setMessage("Something went wrong.");
//           break;
//       }
//     });
//   }, [stripe]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js hasn't yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }

//     setIsLoading(true);

//     const error = await stripe
//       .confirmPayment({
//         elements,
//         confirmParams: {
//           // Make sure to change this to your payment completion page
//           return_url: "http://localhost:3000/order/success",
//           // `http://localhost:3000/order/success`,

//         },
//         // mode: "payment",
//         // success_url: "http://localhost:3000/order/success",
//         // cancel_url: "",
//       })
//       // .then(function (result) {

//       //   console.log(result, "result");
//       //   if (result.error) {
//       //     console.log(result.error);
//       //     // Inform the customer that there was an error.
//       //   }
//       // });


//     // await stripe.confirmCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', {
//     //   payment_method: {
//     //     billing_details: {
//     //       name: 'Jenny Rosen',
//     //     },
//     //   }
//     //   })
//     //   .then(function (result) {

//     //     console.log(result, "result");
//     //     if (result.error) {
//     //       // Inform the customer that there was an error.
//     //     }
//     //   });

//     // This point will only be reached if there is an immediate error when
//     // confirming the payment. Otherwise, your customer will be redirected to
//     // your `return_url`. For some payment methods like iDEAL, your customer will
//     // be redirected to an intermediate site first to authorize the payment, then
//     // redirected to the `return_url`.
//     if (error.type === "card_error" || error.type === "validation_error") {
//       console.log(error);
//       setMessage(error.message);
//     } else {
//       setMessage("An unexpected error occurred.");
//       console.log(error);
//     }
//     setIsLoading(false);
//     // console.log(payment_intent, "payment_intent");
//     // console.log(payment_intent.succeeded, "payment_intent.succeeded");
//     // navigate("/order/success");
//   };

//   const paymentElementOptions = {
//     layout: "tabs",
//   };

//   return (
//     <div className="payment-form">
//       {" "}
//       <form id="payment-form" className="payment" onSubmit={handleSubmit}>
//         <LinkAuthenticationElement
//           id="link-authentication-element"
//           onChange={(event) => setEmail(event.complete ? event.email : "")}
//         />
//         <PaymentElement id="payment-element" options={paymentElementOptions} />
//         <button
//           className="payment-btn"
//           disabled={isLoading || !stripe || !elements}
//           id="submit"
//         >
//           <span id="button-text">
//             {isLoading ? (
//               <div className="spinner payment-spin" id="spinner"></div>
//             ) : (
//               "Pay now"
//             )}
//           </span>
//         </button>
//         {/* Show any error or success messages */}
//         {message && <div id="payment-message">{message}</div>}
//       </form>
//     </div>
//   );
// }
