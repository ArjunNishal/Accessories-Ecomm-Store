import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { axiosInstance, renderUrl } from "../../config";

const Editcategory = ({ categories, fetchCategories, showeditcat }) => {
  const token = localStorage.getItem("admin");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = React.useRef(null);
  useEffect(() => {
    setName(categories.name);
  }, [categories]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      // Send the form data to the backend API
      const response = await axiosInstance.put(
        `category/updatecategory/${categories._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        text: response.data.message,
      });
      setName("");
      setImage(null);
      fetchCategories();
      showeditcat();
      fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        text: "Failed to add category",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center p-2">
      <form onSubmit={handleFormSubmit}>
        <h4>Edit Category</h4>
        <hr />
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="name">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="image">
            Category Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            className="filebtn"
            id="image"
            onChange={(event) => setImage(event.target.files[0])}
          />
        </div>
        <div className="form-group mb-3 border p-2 rounded">
          <p>
            <b>Previous image</b>
          </p>
          <img
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
            }}
            src={`${renderUrl}uploads/category/${categories.image}`}
            alt="previous image"
          />
        </div>
        <button type="submit" className="btn btn-primary addcategory-btn">
          Edit Category
        </button>
        <button className="btn btn-outline-danger mx-2" onClick={showeditcat}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Editcategory;
