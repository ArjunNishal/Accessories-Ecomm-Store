import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance, token, renderUrl } from "../../../config";

const Singleproduct = ({ productid, gotoedit, gotocomboedit }) => {
  const token = localStorage.getItem("admin");
  const [product, setProduct] = useState(null);
  const [Category, setCategory] = useState([]);
  const [bigimage, setbigimage] = useState("");
  const [categories, setCategories] = useState([]);

  console.log(product, "product");
  const gotoeditpage = () => {
    if (product.productType === "Single") {
      gotoedit();
    } else {
      gotocomboedit();
    }
  };
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
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(
          `product/products/${productid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;

        if (response.status === 200) {
          setProduct(data);
          setbigimage(data.images[0]);
          setCategory(data.category);
          console.log(data.offer, "Category");
        } else {
          console.log("Failed to fetch product");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchProduct();
  }, [productid]);

  if (!product) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px", width: "100%" }}
      >
        {" "}
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const deleteProduct = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`product/deleteproduct/${productid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            Swal.fire("Deleted!", "Product deleted successfully.", "success");
            gotoedit();
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", "Failed to delete product.", "error");
          });
      } else {
        Swal.fire("Cancelled", "Product deletion canceled.", "info");
      }
    });
  };

  return (
    <div className="home-section">
      <section className="padding-y">
        <div className="container p-3">
          <div className="row">
            <aside className="col-lg-6">
              <article className="gallery-wrap">
                {/* Render product images */}
                <div className="img-big-wrap img-thumbnail">
                  <Link data-fslightbox="mygalley" data-type="image">
                    <img
                      height="560"
                      style={{
                        width: "100%",
                        objectFit: "contain",
                        maxHeight: "100%",
                      }}
                      src={`${renderUrl}uploads/products/${bigimage}`}
                      alt="Product"
                    />
                  </Link>
                </div>
                <div className="thumbs-wrap">
                  {product.images.map((image, index) => (
                    <Link
                      key={index}
                      data-fslightbox="mygalley"
                      data-type="image"
                      className="item-thumb"
                    >
                      <img
                        className="p-1 border"
                        width="60"
                        height="60"
                        onClick={() => {
                          setbigimage(image);
                        }}
                        src={`${renderUrl}uploads/products/${image}`}
                        alt={`Image ${index + 1}`}
                      />
                    </Link>
                  ))}
                </div>
              </article>
            </aside>
            <main className="col-lg-6">
              <article className="ps-lg-3">
                <h4 className="title text-dark">{product.name}</h4>

                <div className="mb-3">
                  <var className="price h5">₹{product.price}</var>
                </div>
                <p>
                  <b>Description:</b>
                  {product.description}
                </p>
                <p>
                  <b>Discount : </b>
                  {product.discount}
                </p>
                <div>
                  <b>Categories :</b>
                  {Category.map((cat, index) => {
                    const categoryname = categories.find(
                      (cate) => cate._id === cat
                    );
                    return <p key={index}>{categoryname.name}</p>;
                  })}
                </div>
                {product.offer && (
                  <p>
                    <b>Offer : </b>
                    {product.offer.name}
                  </p>
                )}
                <hr />
                <Link
                  to="#"
                  className="btn btn-warning m-1"
                  // onClick={gotoedit}
                  onClick={() => {
                    if (product.productType === "Single") {
                      gotoedit();
                    } else {
                      gotocomboedit();
                    }
                  }}
                >
                  Edit Product
                </Link>
                <Link
                  to="#"
                  className="btn btn-primary m-1"
                  onClick={deleteProduct}
                >
                  <i className="me-1 fa fa-shopping-basket"></i> Delete product
                </Link>
              </article>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Singleproduct;
