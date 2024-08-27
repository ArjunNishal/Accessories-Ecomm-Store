import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { axiosInstance, token, renderUrl } from "../../../config";
import { NavLink, useNavigate } from "react-router-dom";

const Editproduct = ({ getAllProducts, productid, closeproduct }) => {
  const token = localStorage.getItem("admin");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    highlight: false,
    discount: "",
    availability: "instock",
    offer: "",
    description: "",
    colors: [],
    options: {
      options: [],
    },
  });

  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.get(
        `product/products/${productid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log(data, "id");
      if (response.status === 200) {
        const selectedCategoryIds = data.category.map(
          (categoryId) => categoryId
        );
        const itemcolors = data.colors.map((col) => col);
        const itemoptions = data.options.options[0].options.map((col) => col);
        console.log(itemoptions, "itemoptions");
        if (selectedCategoryIds.length > 0) {
          const matchedcategories = categories.filter((cat) =>
            selectedCategoryIds.includes(cat._id)
          );
          console.log(itemoptions, "itemoptions");

          if (matchedcategories.length > 0) {
            const matchedCategoryIds = matchedcategories.map(
              (category) => category._id
            );
            console.log(itemoptions, "itemoptions");
            setSelectedCategories(matchedCategoryIds);
            setProduct({
              _id: data._id,
              name: data.name,
              price: data.price,
              highlight: data.highlight,
              discount: data.discount,
              availability: data.availability,
              offer: data.offer ? data.offer._id : "",
              description: data.description,
              colors: itemcolors,
              options: {
                options: data.options.options[0].options.map((col) => col),
              },
            });
            setSelectedColors(itemcolors);
            console.log(product);
            setpreviousimages(data.images);
          }
        } else {
          console.log("Failed to fetch product");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productid, categories]);

  const fileInputRef = React.useRef(null);
  console.log(product, "selectedCategories");
  const [Offers, setOffers] = useState([]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [previousimages, setpreviousimages] = useState([]);

  const handleInputChange = (event) => {
    console.log(product, "before");
    const { name, value } = event.target;
    console.log(name, value, "name,value");
    if (name === "offer") {
      if (value === "" || value === null || value === undefined) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          offer: "",
        }));
        return;
      }
      setProduct((prevProduct) => ({
        ...prevProduct,
        offer: value,
      }));
      console.log("one", value, name);
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };
  // console.log(product, "after");

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      highlight: checked,
    }));
    // console.log(product,"checked",checked, "product");
  };
  // console.log(product.highlight);
  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
  };

  // options select for product form
  const handleOptionChange = (event) => {
    const optionValue = event.target.value;
    const isChecked = event.target.checked;

    setProduct((prevProduct) => {
      const updatedOptions = isChecked
        ? [...prevProduct.options.options, optionValue]
        : prevProduct.options.options.filter(
            (option) => option !== optionValue
          );
      console.log(updatedOptions);

      return {
        ...prevProduct,
        options: {
          ...prevProduct.options,
          options: updatedOptions,
        },
      };
    });
  };

  console.log(product.options, "selectedImages");
  //   console.log(categories);
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("highlight", product.highlight);
    formData.append("discount", product.discount);
    formData.append("availability", product.availability);
    formData.append("offer", product.offer);
    formData.append("options", JSON.stringify(product.options));
    formData.append("description", product.description);
    formData.append("colors", JSON.stringify(product.colors));
    // for (let i = 0; i < product.colors.length; i++) {
    //   const color = product.colors[i];
    //   formData.append("colors", JSON.stringify(color));
    // }
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }
    for (let i = 0; i < selectedCategories.length; i++) {
      formData.append("category", selectedCategories[i]);
    }

    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }

    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    } else {
      axiosInstance
        .put(`product/updateproduct/${product._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          Swal.fire("Success", response.data.message, "success");
          console.log(response.data);
          getAllProducts();
          closeproduct();
        })
        .catch((error) => {
          Swal.fire("Error", error.response.data.message, "error");
          console.error(error, "catcherror");
        });
    }
  };

  useEffect(() => {
    // Function to fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("category/view/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        // console.log(response)
        setCategories(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await axiosInstance.get("offer/view/offers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        // console.log(response)
        setOffers(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    // Call the fetchCategories function
    fetchOffers();
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    if (selectedCategories.includes(value)) {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== value)
      );
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };
  // console.log(selectedCategories, "selectedCategories");

  const removeSelectedCategory = (categoryId) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((catId) => catId !== categoryId)
    );
  };

  //   delete pics

  const handleDeleteImage = (e, imageName) => {
    e.preventDefault();
    // alert(imageName);
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`product/deleteimg/${imageName}/${productid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log(response.data.message);
            Swal.fire({
              icon: "success",
              text: response.data.message,
            });
            // getAllProducts();
            // fetchProduct();
            // navigate("/products");
            // closeproduct();
            // fetchProduct();
            const filteredimages = previousimages.filter(
              (img) => img === response.data.data
            );
            setpreviousimages(filteredimages);
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              text: "An error occurred",
            });
          });
      }
    });
  };

  // color
  const [color, setColor] = useState("");
  const [colorName, setColorName] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [colormsg, setColormsg] = useState("");

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleColorNameChange = (e) => {
    setColorName(e.target.value);
  };

  const handleAddColor = () => {
    if (color && colorName) {
      const trimmedColor = color.trim();
      setSelectedColors([
        ...selectedColors,
        { name: colorName, shade: trimmedColor },
      ]);
      setProduct((prevProduct) => ({
        ...prevProduct,
        colors: [
          ...prevProduct.colors,
          { name: colorName, shade: trimmedColor },
        ],
      }));
      setColor("");
      setColorName("");
      setColormsg("");
      // console.log(selectedColors, product.colors);
    } else {
      setColormsg("Both color and name are required.");
    }
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...selectedColors];
    updatedColors.splice(index, 1);
    setSelectedColors(updatedColors);

    const updatedProduct = { ...product };
    updatedProduct.colors.splice(index, 1);
    setProduct(updatedProduct);
  };

  return (
    <>
      <div className="container">
        <h3>Edit Product</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6 p-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-6 p-3">
              {" "}
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={product.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-3 p-3">
              <label htmlFor="discount">Discount Price</label>
              <input
                type="number"
                id="discount"
                name="discount"
                placeholder="Enter same Amount if no discount"
                className="form-control"
                value={product.discount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-3 p-3">
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                name="availability"
                className="form-select"
                value={product.availability}
                onChange={handleInputChange}
              >
                <option value="instock">in stock</option>
                <option value="outofstock">out of stock</option>
              </select>
            </div>
            <div className="col-3 p-3">
              <label htmlFor="offer">Offer</label>
              <select
                id="offer"
                name="offer"
                className="form-select"
                value={product.offer}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  console.log("Selected value:", selectedValue);
                  handleInputChange(event);
                }}
              >
                <option value="">Select an offer</option>
                {Offers.map((offer, index) => (
                  <option key={index} value={offer._id}>
                    {offer.name}
                  </option>
                ))}
              </select>
            </div>
            <hr />
            <h4>Select Form Options : </h4>
            <div className="col-12 p-2 gap-2 d-flex flex-wrap">
              <div className="form-check col-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="option1"
                  name="options"
                  value="multiple-image"
                  checked={product.options?.options.includes("multiple-image")}
                  onChange={handleOptionChange}
                  autoComplete="off"
                />
                <label htmlFor="option1" className="form-check-label">
                  multiple image upload{" "}
                </label>
              </div>
              <div className="form-check col-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="option2"
                  name="options"
                  value="single-image"
                  checked={product.options?.options.includes("single-image")}
                  onChange={handleOptionChange}
                  autoComplete="off"
                />
                <label htmlFor="option2" className="form-check-label">
                  single image upload
                </label>
              </div>
              <div className="form-check col-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="option3"
                  name="options"
                  value="nametag"
                  checked={product.options?.options.includes("nametag")}
                  onChange={handleOptionChange}
                  autoComplete="off"
                />
                <label htmlFor="option3" className="form-check-label">
                  Nametag{" "}
                </label>
              </div>
              <div className="form-check col-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="option4"
                  name="options"
                  value="charmtag"
                  checked={product.options?.options.includes("charmtag")}
                  onChange={handleOptionChange}
                  autoComplete="off"
                />
                <label htmlFor="option4" className="form-check-label">
                  Charmtag{" "}
                </label>
              </div>
              <div className="form-check col-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="option5"
                  name="options"
                  value="font-dropdown"
                  checked={product.options?.options.includes("font-dropdown")}
                  onChange={handleOptionChange}
                  autoComplete="off"
                />
                <label htmlFor="option5" className="form-check-label">
                  Font Dropdown
                </label>
              </div>
              <div className="form-check col-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="option6"
                  name="options"
                  value="two-names"
                  checked={product.options?.options.includes("two-names")}
                  onChange={handleOptionChange}
                  autoComplete="off"
                />
                <label htmlFor="option6" className="form-check-label">
                  Name on product for 1st and 2nd product.
                </label>
              </div>
              <div className="form-check col-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="option7"
                  name="options"
                  value="model-dropdown"
                  checked={product.options?.options.includes("model-dropdown")}
                  onChange={handleOptionChange}
                  autoComplete="off"
                />
                <label htmlFor="option7" className="form-check-label">
                  Model dropdown
                </label>
              </div>
              <div className="form-check col-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="option8"
                  name="options"
                  value="mobiletag"
                  checked={product.options?.options.includes("mobiletag")}
                  onChange={handleOptionChange}
                  autoComplete="off"
                />
                <label htmlFor="option8" className="form-check-label">
                  Mobiletag{" "}
                </label>
              </div>
            </div>
            <hr />
            <div className="p-3 col-12">
              <label htmlFor="color">Add Colors</label>
              <p className="text-danger">
                ***Choose color from bar and then add name for shade***
              </p>
              <div className="row align-items-center">
                <div className="col-1">
                  <input
                    type="color"
                    id="color"
                    className="form-control"
                    name="color"
                    value={color}
                    onChange={handleColorChange}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    id="colorName"
                    className="form-control"
                    name="colorName"
                    value={colorName}
                    onChange={handleColorNameChange}
                    placeholder="Enter a color name"
                  />
                </div>
                <div className="col-4">
                  <button
                    type="button"
                    className="btn btn-danger py-1 px-3"
                    onClick={handleAddColor}
                  >
                    Add Color
                  </button>
                </div>
                {colormsg && <p className="text-danger">{colormsg}</p>}
              </div>

              {selectedColors.length > 0 && (
                <div>
                  <h6>Selected Colors:</h6>
                  <div className="row">
                    {selectedColors.map((selectedColor, index) => (
                      <div
                        key={index}
                        className="border p-1 col-2 rounded d-flex justify-content-between"
                        style={{ color: selectedColor.shade }}
                      >
                        {selectedColor.name} - {selectedColor.shade}
                        <button
                          type="button"
                          className=" btn-close ml-2"
                          onClick={() => handleRemoveColor(index)}
                        ></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            .{/* categories */}
            <div className="p-3">
              <label>
                <b>Categories</b>
              </label>
              {selectedCategories.length > 0 && (
                <div className="col-12">
                  <p className="m-0">selected categories:</p>
                  <div className="row col-12 gap-1 pb-3">
                    {selectedCategories.map((categoryId, index) => {
                      const category = categories.find(
                        (cat) => cat._id === categoryId
                      );
                      return (
                        <div
                          className="d-flex justify-content-between col-2 border "
                          key={index}
                        >
                          <div>{category ? category.name : ""}</div>
                          <div>
                            {" "}
                            <button
                              className="btn-close"
                              onClick={() => removeSelectedCategory(categoryId)}
                            ></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="row p-2">
                {categories.map((category) => (
                  <div key={category._id} className="form-check col-3">
                    <input
                      type="checkbox"
                      name="categories"
                      value={category._id}
                      className="form-check-input"
                      onChange={handleCategoryChange}
                      checked={selectedCategories.includes(category._id)}
                    />
                    <label htmlFor={category.id} className="form-check-label">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* description */}
            <div className="p-3">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={product.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-4 p-2 d-flex flex-column justify-items-center">
              <label htmlFor="images" className="form-label text-start">
                ADD MORE IMAGES
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="images"
                multiple
                onChange={handleImageChange}
                className="filebtn"
                key={selectedCategories.length}
                accept="image/*"
              />
            </div>
            <div className="row align-items-center">
              {Array.from(selectedImages).map((image, index) => (
                <div key={index} className="preview-image col-md-4">
                  <img
                    id="previewimage"
                    className="previewimage p-3"
                    src={URL.createObjectURL(image)}
                    alt="preview"
                  />
                  {/* <span>{image.name}</span> */}
                </div>
              ))}
            </div>
            <div className="col-6 p-2 gap-2 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input"
                id="btncheck1"
                name="highlight"
                checked={product.highlight}
                onChange={handleCheckboxChange}
                autoComplete="off"
              />
              <label htmlFor="btncheck1">Highlight</label>
            </div>
          </div>
          <hr />

          <div className="row align-items-center border rounded m-2">
            <b>Previous images</b>
            {Array.from(previousimages).map((image, index) => (
              <div
                key={index}
                className="preview-image text-center col-md-3 border rounded m-1 p-3"
              >
                <div>
                  <img
                    id="previewimage"
                    className="previewimage p-3"
                    src={`${renderUrl}uploads/products/${image}`}
                    alt="preview"
                  />
                </div>
                <div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => handleDeleteImage(e, image)}
                  >
                    Delete
                  </button>
                </div>
                {/* <span>{image.name}</span> */}
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <button className="btn my-5 btn-success col-4" type="submit">
              SAVE
            </button>
          </div>
        </form>
        <hr />
      </div>
    </>
  );
};

export default Editproduct;
