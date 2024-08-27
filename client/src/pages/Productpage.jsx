import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
// import { Productlist } from "../components/Productlist";
import { useDispatch, useSelector } from "react-redux";
import { ADD, decQuantity, Removeitem } from "../redux/actions/action";
import { axiosInstance, renderUrl } from "../config";
import { Rating } from "react-simple-star-rating";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import moment from "moment";

const Productpage = () => {
  const { name } = useParams("");
  // console.log(id);
  const [bigimage, setbigimage] = useState("");
  const [token, settoken] = useState("");
  const [userid, setuserid] = useState("");
  const [id, setid] = useState("");
  const [product, setproduct] = useState({});
  const [images, setimages] = useState([]);
  const [nametag, setnametag] = useState(false);
  const [multipleImage, setmultipleImage] = useState(false);
  const [singleImage, setsingleImage] = useState(false);
  const [charmtag, setcharmtag] = useState(false);
  const [fontDropdown, setfontDropdown] = useState(false);
  const [fontimage, setfontimage] = useState(false);
  const [charmimg, setcharmimg] = useState(false);

  const [modelDropdown, setmodelDropdown] = useState(false);
  const [twoNames, settwoNames] = useState(false);
  const [mobiletag, setmobiletag] = useState(false);
  const [inputValues, setInputValues] = useState({});
  console.log(inputValues);
  // console.log(product);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    } else {
      settoken(token);
      const decoded = jwtDecode(token);
      setuserid(decoded.id);
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`product/products/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        if (response.status === 200) {
          setproduct(data);
          console.log(data, "product");
          setbigimage(data.images[0]);
          setimages(data.images);
          setid(data._id);
          console.log(data.options.options[0].options, "combo");
          if (data.productType === "Single") {
            if (data.options.options[0].options.includes("nametag")) {
              setnametag(true);
            }
            if (data.options.options[0].options.includes("multiple-image")) {
              setmultipleImage(true);
            }
            if (data.options.options[0].options.includes("single-image")) {
              setsingleImage(true);
            }
            if (data.options.options[0].options.includes("charmtag")) {
              setcharmtag(true);
            }
            if (data.options.options[0].options.includes("model-dropdown")) {
              setmodelDropdown(true);
              console.log(fontimage, "setfontimage");
            }
            if (data.options.options[0].options.includes("font-dropdown")) {
              setfontDropdown(true);
              setfontimage(true);
            }

            if (data.options.options[0].options.includes("two-names")) {
              settwoNames(true);
            }
            if (data.options.options[0].options.includes("mobiletag")) {
              setmobiletag(true);
            }
          }
          if (data.productType === "combo") {
            const fontexist = Object.keys(data.options.options[0]).map(
              (keyName, i) => {
                return data.options.options[0][keyName].includes(
                  "font-dropdown"
                );
              }
            );
            const charmexist = Object.keys(data.options.options[0]).map(
              (keyName, i) => {
                return data.options.options[0][keyName].includes("charmtag");
              }
            );
            console.log(fontexist, charmexist, "comboprod");
            if (fontexist.includes(true)) {
              setfontimage(true);
            }
            if (charmexist.includes(true)) {
              setcharmimg(true);
            }
          }
          // map products>>product.nametag? then print
          // console.log(data.isLeatherProduct, "Category");
        } else {
          console.log("Failed to fetch product");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchProduct();
  }, [name]);

  // get quantity of the product in the cart
  const getTotalQuantity = () => {
    const totalQuantity = getdata
      .filter((item) => item._id === product._id)
      .reduce((total, item) => total + item.quantity, 0);
    return totalQuantity;
  };

  // redux start
  const dispatch = useDispatch();

  // cart items in local storage
  const getdata = useSelector((state) => state.cartReducer.carts);
  // console.log(product);

  // add item in cart
  const send = (item) => {
    // console.log(item);
    dispatch(ADD(item));
  };

  // check item already in cart or not
  const isItemInCart = (itemId) => {
    if (getdata === null || getdata === undefined) {
      return false; // Return false if the `getdata` array is null or undefined
    }

    return getdata.some((el) => el._id === itemId);
  };

  // send the details of the product to cart
  const [nameOnProduct, setNameOnProduct] = useState("");
  const [nameOnProduct1, setNameOnProduct1] = useState("");
  const [mobilename, setmobilename] = useState("");
  const [nameOnProduct2, setNameOnProduct2] = useState("");
  const [selectedCharm, setSelectedCharm] = useState("");
  const [selectedfont, setSelectedfont] = useState("");
  const [selectedmodel, setSelectedmodel] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [color, setColor] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [longname, setlongname] = useState(false);
  const [longname2, setlongname2] = useState(false);
  const [error, seterror] = useState("");
  const [multipleImages, setMultipleImages] = useState([]);
  const [multipleImageDocs, setmultipleImageDocs] = useState([]);
  const [singleImageDoc, setsingleImageDoc] = useState(null);
  const [singleImageselected, setSingleImageselected] = useState(null);

  useEffect(() => {
    // Add 20 rs to the total price if nameOnProduct, nameOnProduct1, or nameOnProduct2 have more than 20 characters
    if (
      nameOnProduct.length > 20 ||
      nameOnProduct1.length > 20 ||
      nameOnProduct2.length > 20
    ) {
      if (
        (nameOnProduct1.length > 20 && nameOnProduct2.length > 20) ||
        (nameOnProduct.length > 20 &&
          nameOnProduct1.length > 20 &&
          nameOnProduct2.length > 20)
      ) {
        setlongname2(true);
      } else {
        // Update the state correctly using a functional update
        setlongname(true);
      }
      // console.log("over 20");
    } else {
      setlongname(false);
      if (nameOnProduct1.length <= 20 && nameOnProduct2.length <= 20) {
        setlongname2(false);
      }
      // console.log(
      //   "under 20",
      //   nameOnProduct.length,
      //   nameOnProduct1.length,
      //   nameOnProduct2.length
      // );
    }
  }, [nameOnProduct, nameOnProduct1, nameOnProduct2]);

  const handleSubmit = async (event = null) => {
    if (event) {
      event.preventDefault();
    }

    try {
      // ... Validation checks for different form fields
      if (product.productType === "Single") {
        if (product.colors?.length>0 && !color) {
          seterror("please choose a color");
          return;
        }
        if (nametag && !nameOnProduct) {
          seterror(" Please enter name on the product");
          return;
        }

        if (multipleImage && !multipleImages) {
          seterror("Please select images");
          return;
        }

        if (singleImage && !multipleImages) {
          seterror("Please select images");
          return;
        }
        if (twoNames && (!nameOnProduct1 || !nameOnProduct2)) {
          seterror("Please enter names for both products");
          return;
        }
        if (charmtag && !selectedCharm) {
          seterror("Please select charm");
          return;
        }
        if (fontDropdown && !selectedfont) {
          seterror("Please select font");
          return;
        }
        if (modelDropdown && !selectedmodel) {
          seterror("Please select model");
          return;
        }
        if (mobiletag && !mobilename) {
          seterror("Please enter mobile model");
          return;
        }

      }

      const item = {
        ...product,
        nameOnProduct,
        nameOnProduct1,
        nameOnProduct2,
        selectedfont,
        mobilename,
        selectedmodel,
        selectedCharm,
        specialInstructions,
        color,
        giftWrap,
        longname,
        longname2,
      };

      // Create FormData for other form data
      const productdetails = {
        nameOnProduct,
        nameOnProduct1,
        nameOnProduct2,
        selectedfont,
        mobilename,
        selectedmodel,
        selectedCharm,
        specialInstructions,
        color,
        giftWrap,
        productType: product.productType,
        _id: product._id,
      };
      // console.log(productdetails);
      // Create FormData for image upload
      const imageData = new FormData();

      // Append singleImage (if exists)
      if (singleImage) {
        imageData.append("singleImage", singleImageselected);
      }

      // Append multipleImages (if exist)
      if (multipleImages.length > 0) {
        for (let i = 0; i < multipleImages.length; i++) {
          imageData.append("multipleImage", multipleImages[i]);
        }
      }

      if (multipleImages.length > 0 || singleImage) {
        // Upload images to the backend
        const uploadimage = await axiosInstance.post(
          "cart/uploadimage",
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const res = uploadimage.data;
        // console.log(res);
        if (res.singleImageDoc) {
          setsingleImageDoc(res.singleImageDoc);
          productdetails.singleImage = res.singleImageDoc.name;
          item.singleImage = res.singleImageDoc.name;
          // console.log(res.singleImageDoc.name);
        }
        if (res.multipleImageDocs) {
          setmultipleImageDocs(res.multipleImageDocs);
          const multipleImageNames = res.multipleImageDocs.map(
            (doc) => doc.name
          );
          productdetails.multipleImage = multipleImageNames;
          // console.log(res.multipleImageDocs);
          item.multipleImage = multipleImageNames;
        }
      }
      // console.log(productdetails);
      // Make API request to add item to cart using the form data
      if (token) {
        // console.log(productdetails);
        await axiosInstance.post("cart/add", productdetails, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Send data elsewhere
      send(item);

      seterror("");
    } catch (error) {
      // Handle error if needed
      console.error(error);
    }
  };

  // get all charms

  const [charms, setCharms] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchCharms();
    fetchModels();
  }, []);

  const fetchModels = () => {
    axiosInstance
      .get("model/getmodel")
      .then((response) => {
        setModels(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCharms = () => {
    axiosInstance
      .get("charm/getcharm")
      .then((response) => {
        setCharms(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // get all reviewsof the product

  const [Reviews, setReviews] = useState([]);
  const getAllReviews = async () => {
    try {
      // console.log(name, "reviews");
      const response = await axiosInstance.get(
        `review/products/${name}/reviews`
      );
      const reviews = response.data;

      // Sort the reviews by the latest date (createdAt)
      const sortedReviews = reviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // console.log(sortedReviews,reviews, "sortedReviews");
      setReviews(sortedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    getAllReviews();
  }, [id]);

  const averageRating =
    Reviews.length > 0
      ? Reviews.reduce((total, review) => total + review.rating, 0) /
      Reviews.length
      : 0;
  // console.log(averageRating, "averageRating");

  // review form
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [Reviewimages, setReviewimages] = useState([]);
  const fileInputRef = React.useRef(null);
  const formRef = React.useRef(null);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  // console.log(Reviewimages, "Reviewimages");

  const handleImageUpload = (e) => {
    setReviewimages(e.target.files);
    // console.log(e.target.files);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("product", id);
      formData.append("reviewer", userid);
      formData.append("reviewTitle", reviewTitle);
      formData.append("reviewText", reviewText);
      formData.append("rating", rating);
      for (let i = 0; i < Reviewimages.length; i++) {
        formData.append("images", Reviewimages[i]);
      }

      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }

      const response = await axiosInstance.post("review/addreview", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(response.data);

      // Reset the form fields
      handleReset();
      setReviewTitle("");
      setReviewText("");
      setReviewimages([]);
      getAllReviews();
      console.log(rating, "rating");
      fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    // Set the initial value
    console.log("reset started", rating);
    setRating(0);
  };

  // multiple and single image

  const handleSingleImageChange = (event) => {
    const file = event.target.files[0];
    setSingleImageselected(file);
  };

  const handleMultipleImageChange = (event) => {
    const files = Array.from(event.target.files).slice(0, 5); // Limit to 5 files
    setMultipleImages(files);
  };

  const handlecombosubmit = async (event = null) => {
    if (event) {
      event.preventDefault();
    }
    if (product.colors?.length>0 && !color) {
      seterror("please choose a color");
      return;
    }
    if (!inputValues) {
      seterror("please fill the details for the product");
      return;
    }
   
    try {
      for (const inputKey in inputValues) {
        if (inputKey.includes("single-image")) {
          try {
            const productName = inputKey.split("-")[2]; // Extract product name
            const singleImageFormData = new FormData();
            singleImageFormData.append("singleImage", inputValues[inputKey]);

            // console.log(
            //   inputValues[inputKey],
            //   productName,
            //   singleImageFormData
            // );
            // Upload single image
            const singleImageResponse = await axiosInstance.post(
              "cart/uploadimage",
              singleImageFormData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // console.log(singleImageResponse, "response img");
            // Store the image name in productdetails
            inputValues[`single-image-${productName}`] =
              singleImageResponse.data.singleImageDoc.name;
          } catch (error) {
            console.error("Error uploading single image:", error);
          }
        }
        if (inputKey.includes("multiple-image")) {
          try {
            // console.log(inputValues[inputKey]);
            const productName = inputKey.split("-")[2]; // Extract product name
            const multipleImageFormData = new FormData();
            // inputValues[inputKey].forEach((file) => {
            //   multipleImageFormData.append("multipleImage", file);
            // });
            for (let i = 0; i < inputValues[inputKey].length; i++) {
              multipleImageFormData.append(
                "multipleImage",
                inputValues[inputKey][i]
              );
            }
            // Upload multiple images
            const multipleImageResponse = await axiosInstance.post(
              "cart/uploadimage",
              multipleImageFormData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // console.log(multipleImageResponse, "response multiple images");
            // Store the image names in productdetails
            const multipleImageNames =
              multipleImageResponse.data.multipleImageDocs.map(
                (doc) => doc.name
              );
            inputValues[`multiple-image-${productName}`] = multipleImageNames;
          } catch (error) {
            console.error("Error uploading multiple images:", error);
          }
        }
      }
      // console.log(inputValues);
      const item = {
        ...inputValues,
        ...product,
        specialInstructions,
        giftWrap,
        color,
      };
      const productdetails = {
        inputValues,
        _id: product._id,
        specialInstructions,
        giftWrap,
        color,
        productType: product.productType,
      };
      console.log(productdetails, item);
      if (token) {
        // console.log(productdetails);
        await axiosInstance.post("cart/add", productdetails, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      // console.log(item, "item combo");
      send(item);
      setInputValues({});
    } catch (error) {
      console.error(error);
    }
  };

  const fonts = ["S1", "S2", "S3", "S4", "S5", "S6", "S7"];
  // const models = ["Gold Crystal Pen", "Black Diamond Pen"];

  return (
    <div>
      <Header />

      {/* main-content-wrap start */}
      <div className="main-content-wrap section-ptb product-details-page">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-7 col-md-6">
              <div className="product-details-images">
                <div className="product_details_container">
                  {/* product_big_images start */}
                  <div className="row">
                    <div className="col-2 d-md-block d-none">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="product-small-images  d-flex flex-column"
                        >
                          <div
                            onClick={() => {
                              setbigimage(img);
                            }}
                            className="portfolio-small-image m-1 p-1 "
                          >
                            <img
                              src={`${renderUrl}uploads/products/${img}`}
                              alt=""
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-md-10 col-12">
                      <div className="portfolio-full-image text-center">
                        <img
                          src={`${renderUrl}uploads/products/${bigimage}`}
                          alt="big"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mobilesmall d-md-none d-flex">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="product-small-images col-2  d-flex"
                      >
                        <div
                          onClick={() => {
                            setbigimage(img);
                          }}
                          className="portfolio-small-image m-1 p-1 "
                        >
                          <img
                            src={`${renderUrl}uploads/products/${img}`}
                            alt=""
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* product_big_images end */}
                  {/* End Small images */}
                </div>
              </div>
              {charmtag && (
                <div className="charm-photo py-5">
                  <h3 className="text-center">Charm List</h3>
                  <img
                    src="/assets/images/product/charm.jpg"
                    alt="charm image"
                  />
                </div>
              )}
              {fontimage && (

                <>
                  <div className="charm-photo py-5">
                    <hr />
                    <h3 className="text-center">Font List</h3>
                    <img
                      src="/assets/images/product/fonts.jpg"
                      alt="charm image"
                    />
                  </div>
                </>)

              }
              {charmimg && (
                <div className="charm-photo py-5">
                  <hr />
                  <h3 className="text-center">Charm List</h3>
                  <img
                    src="/assets/images/product/charm.jpg"
                    alt="charm image"
                  />
                </div>
              )}
            </div>
            <div className="col-xl-4 col-lg-5 col-md-6">
              {/* product_details_info start */}
              <div className="product_details_info">
                <h2>{product.name}</h2>
                <ul className="pro_dtl_prize">
                  <li className="old_prize">₹{product.price}</li>
                  <li> ₹{product.discount}</li>
                </ul>
                {/* pro_rating start */}
                <div className="pro_rating d-flex">
                  <ul className="product-rating d-flex">
                    <li>
                      {averageRating >= 1 ? (
                        <i className="fa-solid fa-star"></i>
                      ) : averageRating >= 0.5 ? (
                        <i class="fa-regular fa-star-half-stroke"></i>
                      ) : (
                        <i className="fa-regular fa-star"></i>
                      )}
                    </li>
                    <li>
                      {averageRating >= 2 ? (
                        <i className="fa-solid fa-star"></i>
                      ) : averageRating >= 1.5 ? (
                        <i class="fa-regular fa-star-half-stroke"></i>
                      ) : (
                        <i className="fa-regular fa-star"></i>
                      )}
                    </li>
                    <li>
                      {averageRating >= 3 ? (
                        <i className="fa-solid fa-star"></i>
                      ) : averageRating >= 2.5 ? (
                        <i class="fa-regular fa-star-half-stroke"></i>
                      ) : (
                        <i className="fa-regular fa-star"></i>
                      )}
                    </li>
                    <li>
                      {averageRating >= 4 ? (
                        <i className="fa-solid fa-star"></i>
                      ) : averageRating >= 3.5 ? (
                        <i class="fa-regular fa-star-half-stroke"></i>
                      ) : (
                        <i className="fa-regular fa-star"></i>
                      )}
                    </li>
                    <li>
                      {averageRating >= 5 ? (
                        <i className="fa-solid fa-star"></i>
                      ) : averageRating >= 4.5 ? (
                        <i class="fa-regular fa-star-half-stroke"></i>
                      ) : (
                        <i className="fa-regular fa-star"></i>
                      )}
                    </li>
                  </ul>
                  <span className="rat_qun">
                    {" "}
                    (Based on {Reviews.length} Ratings){" "}
                  </span>
                </div>
                {/* pro_rating end */}
                <div className="freedelivery btn p-2 m-2">
                  <i class="fa-solid fa-truck"></i>&nbsp;
                  <b>FREE DELIVERY</b>
                </div>
                <div className="name-on-product">
                  <form ref={formRef}>
                    <div className={`pro_dtl_color ${product.colors?.length > 0 ? "" : "d-none"}`}>
                      <h2 className="title_2">Choose Colour</h2>
                      <ul className="pro_choose_color">
                        {product.colors &&
                          product.colors.map((item, index) => (
                            <li
                              key={index}
                              className="coloritem text-capitalize text-center"
                              onClick={() => setColor(item)}
                            >
                              <span style={{ color: item.shade }}>
                                <i className="ion-record" />
                              </span>
                              <p>{item.name}</p>
                            </li>
                          ))}
                      </ul>
                    </div>
                    {color && (
                      <div className="pro_dtl_color text-capitalize">
                        <p>
                          Selected Colour :{" "}
                          <span style={{ color: color.shade }}>
                            <i className="ion-record" />
                          </span>
                          &nbsp;
                          {color.name}
                        </p>
                      </div>
                    )}
                    {product.productType === "combo" && (
                      <>

                        {Object.keys(product.options.options[0]).map(
                          (keyName, i) => {
                            return (
                              <div className="combo-inputs" key={i}>

                                {product.options.options[0][keyName].includes(
                                  "nametag"
                                ) && (
                                    <div className="my-2">
                                      <label htmlFor="nameonproduct">
                                        <h6>
                                          Name on{" "}
                                          {
                                            product?.options.products[0][
                                            `product${i}`
                                            ]
                                          }
                                        </h6>
                                      </label>
                                      <input
                                        type="text"
                                        id={`nametag-${product?.options.products[0][
                                          `product${i}`
                                        ]
                                          }`}
                                        className="form-control"
                                        value={
                                          inputValues[
                                          `nametag-${product?.options.products[0][
                                          `product${i}`
                                          ]
                                          }`
                                          ] || ""
                                        }
                                        onChange={(event) =>
                                          setInputValues({
                                            ...inputValues,
                                            [event.target.id]: event.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  )}
                                {product.options.options[0][keyName].includes(
                                  "mobiletag"
                                ) && (
                                    <div className="my-2">
                                      <label htmlFor="mobiletag">
                                        <h6>Mobile Model </h6>
                                      </label>
                                      <input
                                        type="text"
                                        id={`mobiletag-${product?.options.products[0][
                                          `product${i}`
                                        ]
                                          }`}
                                        className="form-control"
                                        value={
                                          inputValues[
                                          `mobiletag-${product?.options.products[0][
                                          `product${i}`
                                          ]
                                          }`
                                          ] || ""
                                        }
                                        onChange={(event) =>
                                          setInputValues({
                                            ...inputValues,
                                            [event.target.id]: event.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  )}
                                {product.options.options[0][keyName].includes(
                                  "multiple-image"
                                ) && (
                                    <>
                                      <div className="form-group py-2">
                                        <label htmlFor="multipleImageInput">
                                          <h6>
                                            Upload Multiple Images for{" "}
                                            {
                                              product?.options.products[0][
                                              `product${i}`
                                              ]
                                            }
                                          </h6>
                                        </label>
                                        <input
                                          type="file"
                                          id={`multiple-image-${product?.options.products[0][
                                            `product${i}`
                                          ]
                                            }`}
                                          className="form-control"
                                          onChange={(event) =>
                                            setInputValues({
                                              ...inputValues,
                                              [event.target.id]:
                                                event.target.files,
                                            })
                                          }
                                          multiple
                                          accept="image/*"
                                        />
                                      </div>
                                      {multipleImages.length > 0 && (
                                        <div className="preview-images row">
                                          {multipleImages.map((image, index) => (
                                            <img
                                              key={index}
                                              src={URL.createObjectURL(image)}
                                              alt={`Preview ${index + 1}`}
                                              className="preview-image col-4"
                                              style={{
                                                maxWidth: "100%",
                                                maxHeight: "100px",
                                                objectFit: "contain",
                                              }}
                                            />
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  )}
                                {product.options.options[0][keyName].includes(
                                  "single-image"
                                ) && (
                                    <div className="form-group py-2">
                                      <label htmlFor="singleImageInput">
                                        <h6>
                                          Upload Single Image for{" "}
                                          {
                                            product?.options.products[0][
                                            `product${i}`
                                            ]
                                          }
                                        </h6>
                                      </label>
                                      <input
                                        type="file"
                                        id={`single-image-${product?.options.products[0][
                                          `product${i}`
                                        ]
                                          }`}
                                        className="form-control"
                                        onChange={(event) =>
                                          setInputValues({
                                            ...inputValues,
                                            [event.target.id]:
                                              event.target.files[0],
                                          })
                                        }
                                        accept="image/*"
                                      />
                                    </div>
                                  )}
                                {product.options.options[0][keyName].includes(
                                  "charmtag"
                                ) && (
                                    <div className="my-2">
                                      <label
                                        className="pt-2"
                                        htmlFor="selectedcharm"
                                      >
                                        <h6>
                                          Select charm for{" "}
                                          {
                                            product?.options.products[0][
                                            `product${i}`
                                            ]
                                          }
                                        </h6>
                                      </label>
                                      <p className="text-danger mb-1">
                                        *See Charm below in Charms list*
                                      </p>
                                      <select
                                        className="form-select"
                                        id={`charmtag-${product?.options.products[0][
                                          `product${i}`
                                        ]
                                          }`}
                                        aria-label="Default select example"
                                        value={
                                          inputValues[
                                          `charmtag-${product?.options.products[0][
                                          `product${i}`
                                          ]
                                          }`
                                          ] || ""
                                        }
                                        onChange={(event) =>
                                          setInputValues({
                                            ...inputValues,
                                            [event.target.id]: event.target.value,
                                          })
                                        }
                                        required
                                      >
                                        <option value="">
                                          Open this select menu
                                        </option>
                                        {charms.map((charm) => (
                                          <option
                                            key={charm.index}
                                            value={charm._id}
                                          >
                                            {charm.index}. {charm.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                {product.options.options[0][keyName].includes(
                                  "font-dropdown"
                                ) && (
                                    <div className="my-2">
                                      <label
                                        className="pt-2"
                                        htmlFor="selectedcharm"
                                      >
                                        <h6>
                                          Select Font for{" "}
                                          {
                                            product?.options.products[0][
                                            `product${i}`
                                            ]
                                          }
                                        </h6>
                                      </label>
                                      <p className="text-danger mb-1">
                                        *See Font style below in Fonts list*
                                      </p>
                                      <select
                                        className="form-select"
                                        id={`font-dropdown-${product?.options.products[0][
                                          `product${i}`
                                        ]
                                          }`}
                                        aria-label="Default select example"
                                        value={
                                          inputValues[
                                          `font-dropdown-${product?.options.products[0][
                                          `product${i}`
                                          ]
                                          }`
                                          ] || ""
                                        }
                                        onChange={(event) =>
                                          setInputValues({
                                            ...inputValues,
                                            [event.target.id]: event.target.value,
                                          })
                                        }
                                        required
                                      >
                                        <option value="">Select font</option>
                                        {fonts.map((font, index) => (
                                          <option key={index} value={font}>
                                            {font}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                {product.options.options[0][keyName].includes(
                                  "model-dropdown"
                                ) && (
                                    <div className="my-2">
                                      <label
                                        className="pt-2"
                                        htmlFor="selectedcharm"
                                      >
                                        <h6>
                                          Select Model of{" "}
                                          {
                                            product?.options.products[0][
                                            `product${i}`
                                            ]
                                          }
                                        </h6>
                                      </label>
                                      <select
                                        className="form-select"
                                        id={`model-dropdown-${product?.options.products[0][
                                          `product${i}`
                                        ]
                                          }`}
                                        aria-label="Default select example"
                                        value={
                                          inputValues[
                                          `model-dropdown-${product?.options.products[0][
                                          `product${i}`
                                          ]
                                          }`
                                          ] || ""
                                        }
                                        onChange={(event) =>
                                          setInputValues({
                                            ...inputValues,
                                            [event.target.id]: event.target.value,
                                          })
                                        }
                                        required
                                      >
                                        <option value="">Select model</option>
                                        {models.map((model, index) => (
                                          <option key={index} value={model?.name}>
                                            {model?.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                <hr className="bg-dark text-dark border-dark border-t-4" />
                              </div>
                            );
                          }
                        )}

                      </>
                    )}

                    {nametag && (
                      <>
                        <label htmlFor="nameonproduct">
                          <h6>Name on Product</h6>
                        </label>
                        <input
                          type="text"
                          id="nameonproduct"
                          className="form-control"
                          value={nameOnProduct}
                          onChange={(event) =>
                            setNameOnProduct(event.target.value)
                          }
                          required
                        />
                      </>
                    )}
                    {mobiletag && (
                      <>
                        <label htmlFor="nameonproduct">
                          <h6>Mobile Model</h6>
                        </label>
                        <input
                          type="text"
                          id="mobilename"
                          className="form-control"
                          value={mobilename}
                          onChange={(event) =>
                            setmobilename(event.target.value)
                          }
                          required
                        />
                      </>
                    )}
                    {twoNames && (
                      <>
                        <label htmlFor="nameonproduct">
                          <h6>Name on Product 1</h6>
                        </label>
                        <input
                          type="text"
                          id="nameonproduct2"
                          className="form-control"
                          value={nameOnProduct1}
                          onChange={(event) =>
                            setNameOnProduct1(event.target.value)
                          }
                          required
                        />
                        <label htmlFor="nameonproduct">
                          <h6>Name on Product 2</h6>
                        </label>
                        <input
                          type="text"
                          id="nameonproduct3"
                          className="form-control"
                          value={nameOnProduct2}
                          onChange={(event) =>
                            setNameOnProduct2(event.target.value)
                          }
                          required
                        />
                      </>
                    )}


                    {fontDropdown && (
                      <>
                        <label className="pt-3" htmlFor="selectedcharm">
                          <h6>Select Font on Product</h6>
                        </label>
                        <p className="text-danger mb-1">
                          *See Font style below in Fonts list*
                        </p>
                        <select
                          className="form-select"
                          id="selectedcharm"
                          aria-label="Default select example"
                          value={selectedfont}
                          onChange={(event) =>
                            setSelectedfont(event.target.value)
                          }
                          required
                        >
                          <option value="">Select font</option>
                          {fonts.map((font, index) => (
                            <option key={index} value={font}>
                              {font}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                    {modelDropdown && (
                      <>
                        <label className="pt-3" htmlFor="selectedcharm">
                          <h6>Select Model of Product</h6>
                        </label>
                        <select
                          className="form-select"
                          id="selectedcharm"
                          aria-label="Default select example"
                          value={selectedmodel}
                          onChange={(event) =>
                            setSelectedmodel(event.target.value)
                          }
                          required
                        >
                          <option value="">Select model</option>
                          {models.map((model, index) => (
                            <option key={index} value={model?.name}>
                              {model?.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {charmtag && (
                      <>
                        <label className="pt-3" htmlFor="selectedcharm">
                          <h6>Select charm on Product</h6>
                        </label>
                        <p className="text-danger mb-1">
                          *See Charm below in Charms list*
                        </p>
                        <select
                          className="form-select"
                          id="selectedcharm"
                          aria-label="Default select example"
                          value={selectedCharm}
                          onChange={(event) =>
                            setSelectedCharm(event.target.value)
                          }
                          required
                        >
                          <option value="">Open this select menu</option>
                          {charms.map((charm) => (
                            <option key={charm.index} value={charm._id}>
                              {charm.index}. {charm.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {/* Display Single Image Input */}
                    {singleImage && (
                      <div className="form-group py-2">
                        <label htmlFor="singleImageInput">
                          <h6>Upload Single Image</h6>
                        </label>
                        <input
                          type="file"
                          id="singleImageInput"
                          className="form-control"
                          onChange={handleSingleImageChange}
                          accept="image/*"
                        />
                      </div>
                    )}

                    {/* Display Multiple Images Input */}
                    {multipleImage && (
                      <div className="form-group py-3">
                        <label htmlFor="multipleImageInput">
                          <h6>Upload Multiple Images</h6>
                        </label>
                        <input
                          type="file"
                          id="multipleImageInput"
                          className="form-control"
                          onChange={handleMultipleImageChange}
                          multiple
                          accept="image/*"
                        />
                      </div>
                    )}
                    {multipleImages.length > 0 && (
                      <div className="preview-images row">
                        {multipleImages.map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="preview-image col-4"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100px",
                              objectFit: "contain",
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <label className="pt-3" htmlFor="specialinstructions">
                      <h6>Any Special Instructions?</h6>
                    </label>
                    <textarea
                      id="specialinstructions"
                      className="form-control"
                      placeholder="If any customization option is unavailable, please provide details here."
                      value={specialInstructions}
                      onChange={(event) =>
                        setSpecialInstructions(event.target.value)
                      }
                    />

                    <div className="py-3 px-2">
                      <h6>Add Gift Wrap to see them smile?</h6>
                      <div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="giftWrap"
                            id="giftWrapYes"
                            checked={giftWrap}
                            onChange={() => setGiftWrap(true)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="giftWrapYes"
                          >
                            Yes (+₹50.00)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="giftWrap"
                            id="giftWrapNo"
                            checked={!giftWrap}
                            onChange={() => setGiftWrap(false)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="giftWrapNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    {error && (
                      <>
                        <p className="text-danger">{error}*</p>
                      </>
                    )}

                    <ul className="pro_dtl_btn">
                      {isItemInCart(product._id) ? (
                        <>
                          {" "}
                          <li>
                            <Link to="/cart" className="buy_now_btn">
                              Go to cart
                            </Link>
                          </li>
                          <li>
                            {product.productType === "combo" ? (
                              <Link
                                className="buy_now_btn"
                                onClick={handlecombosubmit}
                                type="submit"
                              >
                                Add More
                              </Link>
                            ) : (
                              <Link
                                className="buy_now_btn"
                                onClick={handleSubmit}
                                type="submit"
                              >
                                Add More
                              </Link>
                            )}
                          </li>
                        </>
                      ) : (
                        <>
                          {product.productType === "combo" ? (
                            <li>
                              <Link
                                className="buy_now_btn"
                                onClick={handlecombosubmit}
                                type="submit"
                              >
                                Add To Cart
                              </Link>
                            </li>
                          ) : (
                            <li>
                              <Link
                                className="buy_now_btn"
                                onClick={handleSubmit}
                                type="submit"
                              >
                                Add To Cart
                              </Link>
                            </li>
                          )}
                        </>
                      )}
                      {/* <li>
                        <Link to="#">
                          <i className="ion-heart" />
                        </Link>
                      </li> */}
                    </ul>
                    <div class="product-details-module__content">
                      <span>Estimated Delivery </span>
                      <b>Metro Cities</b>
                      <span>: 3-4 days, </span>
                      <b>Non Metro Cities</b>
                      <span>: 3-6 days</span>
                    </div>
                  </form>
                </div>
                {/* product-quantity-action start */}
                <div className="product-quantity-action">
                  {isItemInCart(product._id) ? (
                    <>
                      <div className="prodict-statas">
                        <span>Quantity :</span>
                      </div>
                      <div className="product-quantity plantmore-product-quantity">
                        <div className="d-flex align-items-center justify-content-center">
                          {/* <button
                            onClick={() => {
                              console.log(product, "product");
                              dlt(getdata.find((el) => el._id === product._id));
                            }}
                            className="btn m-1"
                          >
                            -
                          </button> */}
                          <b className="border rounded">
                            {getdata.length > 0 ? getTotalQuantity() : 0}
                          </b>
                          {/* <button
                            onClick={() => {
                              handleSubmit();
                              send(
                                getdata.find((el) => el._id === product._id)
                              );
                            }}
                            className="btn m-1"
                          >
                            +
                          </button> */}
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {/* product_details_info end */}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="product-details-tab mt-60">
                <ul role="tablist" className="mb-50 nav justify-content-center">
                  <li className="nav-item" role="presentation">
                    <button
                      data-bs-toggle="tab"
                      role="tab"
                      data-bs-target="#description"
                      className="active"
                    >
                      Description
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      data-bs-toggle="tab"
                      role="tab"
                      data-bs-target="#reviews"
                    >
                      Reviews
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="product_details_tab_content tab-content">
                {/* Start Single Content */}
                <div
                  className="product_tab_content tab-pane active"
                  id="description"
                  role="tabpanel"
                >
                  <div className="product_description_wrap">
                    <div className="product_desc mb--30">
                      <h2 className="title_3">Details</h2>
                      <p className="support-answer-textarea">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
                {/* End Single Content */}
                {/* Start Single Content */}
                <div
                  className="product_tab_content tab-pane"
                  id="reviews"
                  role="tabpanel"
                >
                  <div className="row">
                    {/* blog-details-wrapper */}
                    <div className="col-lg-7 col-12 review_address_inner">
                      <h5>Comments</h5>
                      {/* Single Review */}
                      {Reviews.length > 0 && Reviews && (
                        <>
                          {Reviews.slice(0, 5).map((rev, index) => (
                            <div className="pro_review row" key={index}>
                              <div className="review_thumb col-3">
                                <img
                                  alt="review images"
                                  src={`${renderUrl}uploads/reviews/${rev.images[0]}`}
                                />
                              </div>
                              <div className="review_details col-8">
                                <div className="review_info">
                                  <h5>{rev.reviewer.username}</h5>
                                  {/* <div className="rating_send">
                                    <Link to="#">Reply</Link>
                                  </div> */}
                                </div>
                                <div className="review_date">
                                  <span>
                                    {" "}
                                    {moment(rev.createdAt).format(
                                      "  Do MMMM YYYY"
                                    )}
                                  </span>{" "}
                                  <span>
                                    {" "}
                                    {moment(rev.createdAt).format("  h:mm a")}
                                  </span>
                                </div>
                                <p className="m-0">
                                  <b>{rev.reviewTitle}</b>
                                </p>
                                <p>{rev.reviewText}</p>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {/*// Single Review */}
                    </div>
                    {userid && (
                      <div className="col-lg-5 col-12">
                        <div className="col-lg-12">
                          <div className="comments-reply-area">
                            <h5 className="comment-reply-title mb-30">
                              Leave a Review
                            </h5>
                            <form
                              className="comment-form-area"
                              onSubmit={handleReviewSubmit}
                            >
                              <div className="comment-input">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <p className="comment-form">
                                      <input
                                        type="text"
                                        required
                                        name="reviewtitle"
                                        placeholder="Review Title *"
                                        value={reviewTitle}
                                        onChange={(event) =>
                                          setReviewTitle(event.target.value)
                                        }
                                      />
                                    </p>
                                  </div>
                                  <div className="col-lg-12">
                                    <p className="comment-form-comment">
                                      <textarea
                                        className="comment-notes"
                                        required
                                        placeholder="Comment *"
                                        value={reviewText}
                                        onChange={(event) =>
                                          setReviewText(event.target.value)
                                        }
                                      />
                                    </p>
                                  </div>
                                  <div className="col-lg-12 my-3">
                                    <div className="rating-stars">
                                      <span className="rating-label">
                                        Rating:{" "}
                                      </span>
                                      <Rating
                                        onClick={handleRatingChange}
                                        size={30}
                                        transition
                                        fillColor="gold"
                                        emptyColor="#ccc"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-12 my-3">
                                    <div className="comment-form-images">
                                      <label htmlFor="imageUpload">
                                        Upload Images (Max 5):
                                      </label>
                                      <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="filebtn"
                                        id="imageUpload"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                      />
                                    </div>
                                  </div>
                                  {Reviewimages.length > 0 && (
                                    <div className="col-lg-12">
                                      <div className="comment-form-images row">
                                        <p>Images Selected</p>
                                        {Array.from(Reviewimages).map(
                                          (image, index) => (
                                            <div
                                              key={index}
                                              className="preview-image col-md-4"
                                            >
                                              <img
                                                id="previewimage"
                                                className="previewimage p-3"
                                                src={URL.createObjectURL(image)}
                                                alt="preview"
                                              />
                                              {/* <span>{image.name}</span> */}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div className="col-lg-12">
                                    <div className="comment-form-submit">
                                      <button
                                        className="comment-submit"
                                        type="submit"
                                      >
                                        SUBMIT
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* End Single Content */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* main-content-wrap end */}
      <Footer />
    </div>
  );
};

export default Productpage;

{
  /* breadcrumb-area start */
}
// {/* <div className="breadcrumb-area section-ptb">
//   <div className="container">
//     <div className="row">
//       <div className="col-12">
//         <h2 className="breadcrumb-title">Signle Product</h2>
//         {/* breadcrumb-list start */}
//         <ul className="breadcrumb-list">
//           <li className="breadcrumb-item">
//             <Link to="/">Home</Link>
//           </li>
//           <li className="breadcrumb-item active">Signle Product</li>
//         </ul>
//         {/* breadcrumb-list end */}
//       </div>
//     </div>
//   </div>
// </div>; */}
{
  /* breadcrumb-area end */
}
