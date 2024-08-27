import React, { useState } from "react";
import { axiosInstance, token } from "../../config";
import Swal from "sweetalert2";

const AddCouponForm = () => {
  const token = localStorage.getItem("admin");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  // const [expirationDate, setExpirationDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post(
        "coupon/addcoupon",
        {
          code,
          discount,
          // expirationDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Display success message
      Swal.fire({
        icon: "success",
        title: "Coupon Added",
        text: response.data.message,
      });

      // Reset the form fields
      setCode("");
      setDiscount("");
      // setExpirationDate("");
    } catch (error) {
      console.error(error);

      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add coupon",
      });
    }
  };

  return (
    <form className="addcoupon-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label" htmlFor="code">
          Code:
        </label>
        <input
          className="form-control"
          type="text"
          id="code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="discount">
          Discount:
        </label>
        <input
          className="form-control"
          type="number"
          id="discount"
          value={discount}
          onChange={(event) => setDiscount(event.target.value)}
        />
      </div>
      {/* <div className="mb-3">
        <label className="form-label" htmlFor="expirationDate">
          Expiration Date:
        </label>
        <input
          className="form-control"
          type="date"
          id="expirationDate"
          value={expirationDate}
          onChange={(event) => setExpirationDate(event.target.value)}
        />
      </div> */}

      <button className="btn btn-primary" type="submit">
        Add Coupon
      </button>
    </form>
  );
};

export default AddCouponForm;
