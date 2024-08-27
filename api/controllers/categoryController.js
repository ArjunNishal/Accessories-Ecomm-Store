const Category = require("../models/categorySchema");
const multer = require("multer");
const Product = require("../models/productSchema");
const path = require("path");

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/category/"); // Specify the folder where uploaded images will be stored
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.split(".")[0];
    const ext = path.extname(file.originalname);
    const date = Date.now();
    const filename = `${originalName.replace(/\s/g, "")}_${date}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// add category
const addCategory = async (req, res) => {
  const { name, priceRange } = req.body;
  const image = req.file ? req.file.filename : "";

  try {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const newCategory = new Category({
      name,
      image,
      priceRange,
      slug,
    });

    const savedCategory = await newCategory.save();

    return res.status(200).send({
      message: "Category added successfully",
      data: savedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Failed to add category" });
  }
};

// get products of selected category
const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  console.log(category);
  try {
    // Find the category with the provided name
    const foundCategory = await Category.findOne({ slug: category });
    console.log(foundCategory);
    if (!foundCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Find products with the matching category id
    const products = await Product.find({ category: foundCategory._id });
    console.log(products);
    if (products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found for the category" });
    }

    console.log(products);
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send({ message: "Failed to fetch products" });
  }
};

const removecategory = async (req, res) => {
  const category = req.params.categoryname;

  console.log(category, "category");

  if (!category) {
    return res.status(500).send("Category not found");
  }

  try {
    const categorymatch = await Category.findByIdAndDelete(category);

    return res.status(200).send({
      message: "Category deleted successfully",
      data: categorymatch,
    });
  } catch (error) {
    return res.status(500).send({ message: "Failed to delete category" });
  }
};

const getCategories = async (req, res) => {
  try {
    // Retrieve all categories from the database
    const categories = await Category.find();

    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch categories" });
  }
};

// Update category
const updateCategory = async (req, res) => {
  const categoryId = req.params.id; // Assuming you pass the category ID as a route parameter
  const { name, priceRange } = req.body;
  const image = req.file ? req.file.filename : "";
  console.log(req.body);
  try {
    // Check if the category with the given ID exists
    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    console.log(existingCategory);
    // Update the category properties
    existingCategory.name = name;
    existingCategory.priceRange = priceRange;
    existingCategory.image = image || existingCategory.image; // Keep the existing image if not provided in the request

    // Recalculate the slug (if needed)
    existingCategory.slug = name.toLowerCase().replace(/\s+/g, "-");

    // Save the updated category
    const updatedCategory = await existingCategory.save();

    return res.status(200).send({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Failed to update category" });
  }
};

module.exports = {
  addCategory,
  getProductsByCategory,
  removecategory,
  getCategories,
  updateCategory,
  upload,
};
