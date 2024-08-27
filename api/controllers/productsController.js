const multer = require("multer");
const Product = require("../models/productSchema");
const fs = require("fs");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/"); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded image
    const currentDateTime = Date.now();
    const originalName = file.originalname.split(".")[0];
    const extension = file.originalname.split(".").pop();
    const uniqueFilename = `${originalName}_${currentDateTime}.${extension}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    discount,
    availability,
    category,
    offer,
    options,
    products,
    highlight,
    colors,
    productType,
  } = req.body;

  console.log(req.body, "body");

  try {
    // Check if the product already exists by name
    const existingProduct = await Product.findOne({ name });
    // console.log("hello");

    if (existingProduct) {
      return res.status(400).send({ message: "Product already exists" });
    }

    // Get the filenames of the uploaded images
    const imageFiles = req.files.map((file) => file.filename);
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    let colorsArray = [];
    let optionsArray = [];
    let productsArray = [];

    try {
      if (colors && typeof colors === "string") {
        colorsArray = JSON.parse(colors);
      }
    } catch (error) {
      console.error("Error parsing colors:", error);
    }
    console.log(colorsArray);
    if (products) {
      productsArray = JSON.parse(products);
    }
    if (options) {
      optionsArray = JSON.parse(options);
    }

    console.log(optionsArray, productsArray, "arrays");
    const newProduct = new Product({
      name,
      description,
      images: imageFiles,
      price,
      discount,
      availability,
      category: [],
      colors: colorsArray,
      options: {
        options: optionsArray,
        products: productsArray,
      },
      highlight: highlight,
      slug,
    });

    if (offer) {
      newProduct.offer = offer;
    }
    if (productType) {
      newProduct.productType = productType;
    }

    // Push each category ID into the category array
    if (Array.isArray(category)) {
      newProduct.category = category;
    } else {
      newProduct.category.push(category);
    }
    // if (Array.isArray(colors)) {
    //   newProduct.colors = colors;
    // } else {
    //   newProduct.colors.push(colors);
    // }

    const savedProduct = await newProduct.save();

    return res.status(200).send({
      message: "New product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Failed to add a new product", error });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const {
    name,
    description,
    price,
    discount,
    availability,
    highlight,
    category,
    offer,
    colors,
    options,
    products,
    productType,
  } = req.body;
  console.log(req.body);
  const images = req.files.map((file) => file.filename);
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  let colorsArray = [];
  let optionsArray = [];
  let productsArray = [];

  try {
    if (colors && typeof colors === "string") {
      colorsArray = JSON.parse(colors);
    }
  } catch (error) {
    console.error("Error parsing colors:", error);
  }
  console.log(colorsArray);
  if (products) {
    productsArray = JSON.parse(products);
  }
  if (options) {
    if (productType === "combo") {
      optionsArray = JSON.parse(options);
    } else {
      optionsArray.push(JSON.parse(options));
    }
  }
  console.log(colorsArray, "|||", optionsArray, "|||", productsArray);
  try {
    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Update the product details
    product.name = name;
    product.description = description;
    product.price = price;
    product.discount = discount;
    product.availability = availability;
    product.category = category;
    product.highlight = highlight;
    product.slug = slug;
    product.colors = colorsArray;
    // product.options = optionsArray;
    product.options =
      productType === "combo"
        ? {
            options: optionsArray,
            products: productsArray,
          }
        : { options: optionsArray };
    if (offer !== "") {
      product.offer = offer;
    } else {
      product.offer = null;
    }
    console.timeLog(product);
    // Update the product images
    product.images.push(...images);

    // Save the updated product
    const updatedProduct = await product.save();

    return res.status(200).send({
      message: "Product details updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Failed to update product details" });
  }
};

module.exports = {
  updateProduct,
};

// Controller function to delete a product
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  console.log(productId);
  try {
    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }
    console.log(product, "product");

    // Delete the product images from the file system
    for (const image of product.images) {
      fs.unlinkSync(`uploads/products/${image}`);
    }
    console.log("done");

    // Delete the product from the database
    const deletedproduct = await Product.findByIdAndDelete(productId);

    return res.status(200).send({
      message: "Product deleted successfully",
      data: deletedproduct,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to delete product", error: error });
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send({ message: "Failed to fetch products" });
  }
};

// get single product with reviews and categories
const getSingleProduct = async (req, res) => {
  const productId = req.params.name;
  console.log(productId, "name");
  try {
    const product = await Product.findOne({ slug: productId }).populate(
      "offer"
    );

    if (!product) {
      return res.status(404).send("Product not found");
    }

    return res.status(200).send(product);
  } catch (error) {
    return res.status(500).send({ message: "Failed to fetch product" });
  }
};

// add the product in highlighted products list
const highlight = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(500).send("Product not found");
    }

    product.highlight = true;
    const updatedProduct = await product.save();

    return res.status(200).send({
      message: "Product added to highlighted list successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to add product to highlighted list", error });
  }
};

// add the product in highlighted products list
const removehighlight = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(500).send("Product not found");
    }

    product.highlight = false;
    const updatedProduct = await product.save();

    return res.status(200).send({
      message: "Product removed from highlighted list successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to add product to highlighted list", error });
  }
};

// get highlighted products (maximum 4nos)
const gethighlighted = async (Req, res) => {
  try {
    const highlighted = await Product.find({ highlight: true }).limit(4);

    if (highlighted.length === 0) {
      return res.status(500).send("No products found");
    }
    // console.log(highlighted, highlighted.length);
    return res
      .status(200)
      .send({ message: "Highlighted products", data: highlighted });
  } catch (error) {
    return res.status(500).send("failed to get the highlighted products");
  }
};

const deleteimg = async (req, res) => {
  const imageName = req.params.imageName;
  const productId = req.params.productid;
  console.log(req.params);

  try {
    // Find the product by its ID
    const product = await Product.findOne({ slug: productId });
    console.log(product, "product");
    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove the image from the images array
    product.images = product.images.filter((image) => image !== imageName);
    console.log(product.images, "images");
    // Save the updated product
    await product.save();
    console.log("saved");

    // Delete the image file
    fs.unlinkSync(`uploads/products/${imageName}`);

    res
      .status(200)
      .json({ message: "Image deleted successfully", data: imageName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete the image" });
  }
};

// search
const searchProducts = async (req, res) => {
  const { query } = req.query;
  console.log(query, "query");
  try {
    const searchResults = await Product.find({
      name: { $regex: query, $options: "i" },
    });

    console.log(searchResults, "searchResults");
    res.json(searchResults);
  } catch (error) {
    console.error("Error searching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for products" });
  }
};

module.exports = {
  addProduct,
  upload,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  highlight,
  searchProducts,
  gethighlighted,
  removehighlight,
  deleteimg,
};
