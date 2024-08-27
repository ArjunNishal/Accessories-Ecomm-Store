import React, { useState } from "react";
import { axiosInstance, token } from "../../config";
import Swal from "sweetalert2";

const CreateOfferComponent = () => {
  const token = localStorage.getItem("admin");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setName(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post(
        "offer/createoffer",
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });

      // Reset the form fields
      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create offer",
      });
    }
  };

  return (
    <div className="col-6">
      <h4>Create New Offer</h4>
      <form className="addcoupon-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            className="form-control"
            name="description"
            value={description}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Create Offer
        </button>
      </form>
    </div>
  );
};

export default CreateOfferComponent;
