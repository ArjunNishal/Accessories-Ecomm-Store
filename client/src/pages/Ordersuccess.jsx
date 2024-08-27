import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { axiosInstance } from "../config";
import { useDispatch } from "react-redux";
import { clearCartAndUser } from "../redux/actions/action";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
// import {useEffectOnce} from 'react-use';

const Ordersuccess = () => {
  // console.log("Ordersuccess component rendering");
  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const SessionId = urlParams.get("session_id");
  const OrderId = urlParams.get("order_id");
  const paymentType = urlParams.get("gateway");
  const [payDone, setpayDone] = useState(false);
  // const paymentstatus = urlParams.get("redirect_status");
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  useEffect(() => {
    if (SessionId && OrderId) {
      // console.log("running===========================", SessionId, OrderId);
      // console.log("Payment status: succeeded");
      handleUpdatePaymentStatus(OrderId);

      // console.log("running1");
    }
  }, [OrderId, SessionId]);

  const dispatch = useDispatch();

  const navigate = useNavigate("");

  const handleUpdatePaymentStatus = async () => {
    try {
      setpayDone(false);
      setPaymentProcessed(false);
      if (paymentType === "upigateway") {
        // let paymentdone = false;
        const url = urlParams.get("client_txn_id");

        const url2 = urlParams.get("txn_id");
        console.log(url, "url");
        console.log(url2, "url2");

        const parts = url.split("=");
        // console.log(parts, "parts");

        const secondPart = parts[1];
        console.log(secondPart, "secondPart");

        const txnParts = secondPart.split("?");
        console.log(txnParts, "txnParts");

        const client_txn_id = txnParts[0];
        // console.log(client_txn_id, "client_txn_id");

        const response = await axiosInstance.post(`payment/paymentstatus/upi`, {
          client_txn_id,
        });
        // console.log(response.data, "response check payment status");
        // console.log(response, "response of status");
        if (response.data.data.status === "success") {
          setpayDone(true);
          paymentdone();
        } else {
          setpayDone(false);
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Payment Failed , please try again",
          });
          navigate(`/paymentType/${OrderId}`);
        }
      } else if (paymentType === "stripe") {
        setpayDone(true);
        paymentdone();
      } else if (paymentType === "cashfree") {
        const cashfreeorderid = urlParams.get("cashfreeorderid");
        console.log(cashfreeorderid, "cashfreeorderid");

        const response = await axiosInstance.post(
          `payment/cashfree/status/${cashfreeorderid}`
        );
        console.log(response.data);
        if (response.data.data.order_status === "PAID") {
          paymentdone();
          setpayDone(true);
        } else {
          setpayDone(false);
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Payment Failed , please try again",
          });
          navigate(`/paymentType/${OrderId}`);
        }
      }
      setPaymentProcessed(true);
    } catch (error) {
      setPaymentProcessed(true);
      setpayDone(false);
      console.error("Error updating payment status:", error);
      // Show SweetAlert2 for error
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
    }
  };
  const paymentdone = async () => {
    try {
      let response;
      if (token) {
        response = await axiosInstance.put(
          `order/updatePaymentStatus/${OrderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axiosInstance.put(
          `user/updatePaymentStatus/${OrderId}`
        );
      }

      if (response.status === 200) {
        dispatch(clearCartAndUser());
        localStorage.removeItem("formData");
        // Show SweetAlert2 after saving the status
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Payment done successfully",
        });
      }
      setPaymentProcessed(true);
    } catch (error) {
      setPaymentProcessed(true);
      console.error("Error updating payment status:", error);
      // Show SweetAlert2 for error
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Payment Failed",
      });
    }
  };

  // check cashfree payment status

  return (
    <div>
      <Header />
      <div className="container p-5">
        {paymentProcessed ? (
          <>
            {payDone ? (
              <>
                <h1>Success!</h1>
                <div>
                  <p>Order Placed Successfully!!</p>
                  <Link to={"/collections/allproducts"} className="btn btn-red">
                    Shop More
                  </Link>
                </div>
              </>
            ) : (
              <>
                {" "}
                <h1>Payment Failed</h1>
              </>
            )}
          </>
        ) : (
          <p>Checking payment details...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Ordersuccess;
