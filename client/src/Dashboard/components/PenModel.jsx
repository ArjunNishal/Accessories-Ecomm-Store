import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../../config";

const PenModel = ({ charmId, fetchCharms }) => {
  const token = localStorage.getItem("admin");
  const [name, setName] = useState("");

  // Fetch charm details and populate form if editing
  useEffect(() => {
    if (charmId) {
      axiosInstance
        .get(`model/get/${charmId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const charm = response.data;
          setName(charm.name);
        })
        .catch((error) => console.error(error));
    }
  }, [charmId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = { name };

    if (charmId) {
      // Update charm
      axiosInstance
        .put(`model/update/${charmId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const updatedCharm = response.data;
          console.log("Model updated:", updatedCharm);
          Swal.fire("Success", "Model updated successfully!", "success");
          setName("");
          fetchCharms();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Error", error.response.data.error, "error");
        });
    } else {
      // Add new charm
      axiosInstance
        .post("model/add", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const newCharm = response.data;
          console.log("New model created:", newCharm);
          Swal.fire("Success", "Model created successfully!", "success");
          setName("");
          fetchCharms();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Error", error.response.data.error, "error");
        });
    }
  };

  return (
    <div className="charmform justify-content-center d-flex">
      <div className="col-6">
        {charmId ? <h4>Update Model</h4> : <h4>Add New Model</h4>}
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Model name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <br />
          
          <button className="btn" type="submit">
            {charmId ? "Update Model" : "Add Model"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PenModel;
