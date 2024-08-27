import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { axiosInstance, token } from "../../config";

const AddCategoryForm = ({ categories, categoryId }) => {
  const token = localStorage.getItem("admin");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = React.useRef(null);
  const [index, setIndex] = useState("");



  useEffect(() => {
    if (categoryId) {
      axiosInstance
        .get(`charm/get/${categoryId}`, {
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
  }, [categoryId]);


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      // Send the form data to the backend API
      if (categoryId) {
        // Update charm
        axiosInstance
          .put(`charm/updatategorycategoryId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const updatedCharm = response.data;
            console.log("Charm updated:", updatedCharm);
            Swal.fire("Success", "Category updated successfully!", "success");
            setName("");
            setImage(null);
            categories();
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", error.response.data.error, "error");
          });
      } else {
      const response = await axiosInstance.post(
        "category/addcategory",
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
      }


     
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
        <h4>Add new Category</h4>
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
            required
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
            required
          />
        </div>
        <button type="submit" className="btn btn-primary addcategory-btn">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;
