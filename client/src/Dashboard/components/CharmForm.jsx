import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../../config";

const CharmForm = ({ charmId, fetchCharms }) => {
  const token = localStorage.getItem("admin");
  const [name, setName] = useState("");
  const [index, setIndex] = useState("");

  // Fetch charm details and populate form if editing
  useEffect(() => {
    if (charmId) {
      axiosInstance
        .get(`charm/get/${charmId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const charm = response.data;
          setName(charm.name);
          setIndex(charm.index);
        })
        .catch((error) => console.error(error));
    }
  }, [charmId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = { name, index };

    if (charmId) {
      // Update charm
      axiosInstance
        .put(`charm/update/${charmId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const updatedCharm = response.data;
          console.log("Charm updated:", updatedCharm);
          Swal.fire("Success", "Charm updated successfully!", "success");
          setName("");
          setIndex("");
          fetchCharms();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Error", error.response.data.error, "error");
        });
    } else {
      // Add new charm
      axiosInstance
        .post("charm/add", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const newCharm = response.data;
          console.log("New charm created:", newCharm);
          Swal.fire("Success", "Charm created successfully!", "success");
          setName("");
          setIndex("");
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
        {charmId ? <h4>Update Charm</h4> : <h4>Add New Charm</h4>}
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Charm name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <br />
          <label className="form-label" htmlFor="index">
            Charm Number
          </label>
          <input
            type="number"
            className="form-control"
            id="index"
            placeholder="Charm Number"
            name="index"
            value={index}
            onChange={(event) => setIndex(event.target.value)}
            required
          />
          <br />
          <button className="btn" type="submit">
            {charmId ? "Update Charm" : "Add Charm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CharmForm;
