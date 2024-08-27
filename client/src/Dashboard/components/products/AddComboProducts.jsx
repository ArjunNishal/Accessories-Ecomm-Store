import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { axiosInstance } from "../../../config";
import { NavLink, useNavigate } from "react-router-dom";

const AddComboProducts = ({ getAllProducts }) => {
  const fileInputRef = React.useRef(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [createProduct, setCreateProduct] = useState(2);
  const [Offers, setOffers] = useState([]);
  const [options, setOptions] = useState({
    products: [],
    options: [],
  });
  const token = localStorage.getItem("admin");
  const [highlighted, setHighlighted] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    highlight: highlighted,
    discount: "",
    availability: "instock",
    offer: "",
    description: "",
    colors: [],
    options: {
      products: [],
      options: [],
    },
    productType: "combo",
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const handleHighlightedChange = (event) => {
    setHighlighted(event.target.checked);
    // console.log(event.target.checked, event.target.name);
  };

  // options select for product form
  const handleOptionChange = (event, action, parentId) => {
    const optionValue = event.target.value;
    const isChecked = event.target.checked;
    const productArr = [];
    const optionArr = [];
    for (let i = 0; i < createProduct; i++) {
      productArr.push(`product${i}`);
      optionArr.push(`Options${i}`);
    }

    const prod = { ...options };
    console.log(prod, "prod");
    const productIndex = productArr.indexOf(event.target.id);
    const optionIndex = optionArr.indexOf(parentId);

    if (productArr.includes(event.target.id) && action === "productName") {
      prod.products[event.target.id] = event.target.value;
    } else if (action === "productCheckbox") {
      const optionKey = productArr[optionIndex];
      prod.options[optionKey] = prod.options[optionKey] || [];
      if (isChecked) {
        prod.options[optionKey].push(optionValue);
      } else {
        prod.options[optionKey] = prod.options[optionKey].filter(
          (option) => option !== optionValue
        );
      }
    }

    setOptions(prod);
    console.log(
      options,
      options.options,
      options.products,
      JSON.stringify({ ...options.options }),
      JSON.stringify({ ...options.products }),
      prod
    );
  };
  // useEffect(() => {
  //   // Update the 'options' field of the 'product' state
  //   setProduct((prevProduct) => ({
  //     ...prevProduct,
  //     options: { options: options.options, products: options.products },
  //   }));
  //   console.log(product.options);
  // }, [options]);

  // console.log(product.options);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(event.target.value, event.target.name);
    if (name === "availability") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };
  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
    console.log(e.target.files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      options.options,
      options.products,
      JSON.stringify({ ...options.options }),
      JSON.stringify(options.products),
      options.options.length,
      options.products.length
    );
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("highlight", highlighted);
    formData.append("discount", product.discount);
    formData.append("availability", product.availability);
    formData.append("offer", product.offer);
    formData.append("description", product.description);
    formData.append("options", JSON.stringify({ ...options.options }));
    formData.append("products", JSON.stringify({ ...options.products }));
    formData.append("productType", product.productType);
    formData.append("colors", JSON.stringify(product.colors));

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
        .post("product/addproduct", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          Swal.fire("Success", response.data.message, "success");
          console.log(response.data);
          setProduct({
            name: "",
            price: "",
            highlight: false,
            discount: "",
            availability: "instock",
            offer: "",
            description: "",
            options: {
              products: [],
              options: [],
            },
          });
          setSelectedImages([]);
          setSelectedCategories([]);
          setHighlighted(false);
          fileInputRef.current.value = "";
          getAllProducts();
          navigate("/products#pills-home");
        })
        .catch((error) => {
          Swal.fire("Error", error.response.data.message, "error");
          console.error(error, "catcherror");
        });
    }
  };

  const [categories, setCategories] = useState([]);

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
        <h3>Add Combo Product</h3>
        <form className="text-capitalize" onSubmit={handleSubmit}>
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
                className="form-control"
                value={product.discount}
                placeholder="Enter same Amount if no discount"
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
                onChange={handleInputChange}
              >
                <option value="">Select an offer</option>
                {Offers.map((offer) => (
                  <option key={offer._id} value={offer._id}>
                    {offer.name}
                  </option>
                ))}
              </select>
            </div>
            <hr />
            {Array.from(Array(createProduct)).map((c, index) => (
              <>
                <div>
                  <h4 className="text-danger">Product {index + 1}</h4>
                  <div className="col-3 mb-2">
                    {/* <label htmlFor="discount">Product {index+1} Name</label> */}
                    <input
                      type="text"
                      id={`product${index}`}
                      name={`product${index}`}
                      className="form-control"
                      value={product?.options[`product${index}`]?.name}
                      placeholder="Enter name of Product"
                      onChange={(e) => handleOptionChange(e, "productName")}
                      required
                    />
                  </div>

                  <h6>Options : </h6>
                  <div
                    className="col-12 p-2 gap-2 d-flex flex-wrap"
                    id={`Options${index}`}
                  >
                    <div className="form-check col-5">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="option1"
                        name="options"
                        value="multiple-image"
                        checked={product?.options[`product${index}`]?.includes(
                          "multiple-image"
                        )}
                        onChange={(e) =>
                          handleOptionChange(
                            e,
                            "productCheckbox",
                            `Options${index}`
                          )
                        }
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
                        checked={product?.options[`product${index}`]?.includes(
                          "single-image"
                        )}
                        // checked={product.options?.includes("single-image")}
                        onChange={(e) =>
                          handleOptionChange(
                            e,
                            "productCheckbox",
                            `Options${index}`
                          )
                        }
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
                        checked={product?.options[`product${index}`]?.includes(
                          "nametag"
                        )}
                        // checked={product.options?.includes("nametag")}
                        onChange={(e) =>
                          handleOptionChange(
                            e,
                            "productCheckbox",
                            `Options${index}`
                          )
                        }
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
                        checked={product?.options[`product${index}`]?.includes(
                          "charmtag"
                        )}
                        // checked={product.options?.includes("charmtag")}
                        onChange={(e) =>
                          handleOptionChange(
                            e,
                            "productCheckbox",
                            `Options${index}`
                          )
                        }
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
                        checked={product?.options[`product${index}`]?.includes(
                          "font-dropdown"
                        )}
                        // checked={product.options?.includes("font-dropdown")}
                        onChange={(e) =>
                          handleOptionChange(
                            e,
                            "productCheckbox",
                            `Options${index}`
                          )
                        }
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
                        id="option7"
                        name="options"
                        value="model-dropdown"
                        checked={product?.options[`product${index}`]?.includes(
                          "model-dropdown"
                        )}
                        // checked={product.options?.includes("model-dropdown")}
                        onChange={(e) =>
                          handleOptionChange(
                            e,
                            "productCheckbox",
                            `Options${index}`
                          )
                        }
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
                        checked={product?.options[`product${index}`]?.includes(
                          "mobiletag"
                        )}
                        // checked={product.options?.includes("nametag")}
                        onChange={(e) =>
                          handleOptionChange(
                            e,
                            "productCheckbox",
                            `Options${index}`
                          )
                        }
                        autoComplete="off"
                      />
                      <label htmlFor="option8" className="form-check-label">
                        Mobiletag{" "}
                      </label>
                    </div>
                  </div>
                  <hr />
                </div>
              </>
            ))}
            <button
              type="button"
              className="btn btn-danger py-1 px-3 col-md-3 mx-auto"
              onClick={() => setCreateProduct(createProduct + 1)}
            >
              + Add More Product
            </button>
            {/* colors */}
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
                    {selectedCategories.map((categoryId) => {
                      const category = categories.find(
                        (cat) => cat._id === categoryId
                      );
                      return (
                        <div
                          className="d-flex justify-content-between col-2 border "
                          key={categoryId}
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
                  <div key={category.id} className="form-check col-3">
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
                Images
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
                required
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
                checked={highlighted}
                onChange={handleHighlightedChange}
                autoComplete="off"
              />
              <label htmlFor="btncheck1">Highlight</label>
            </div>
          </div>
          <button className="btn mt-5 btn-success" type="submit">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
};

export default AddComboProducts;
