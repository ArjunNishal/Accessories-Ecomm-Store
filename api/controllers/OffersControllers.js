const Offer = require("../models/offersSchema");
const Product = require("../models/productSchema");

const createOffer = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newOffer = new Offer({
      name,
      description,
    });

    const savedOffer = await newOffer.save();

    return res.status(200).send({
      message: "New offer created successfully",
      data: savedOffer,
    });
  } catch (error) {
    return res.status(500).send({ message: "Failed to create offer" });
  }
};

const addOfferToProduct = async (req, res) => {
  const { productIds, offerId } = req.body;

  try {
    // Find the offer by its ID
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).send("Offer not found");
    }

    // Update each product with the offer
    const updatedProducts = [];

    for (const productId of productIds) {
      // Find the product by its ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      // Check if the product already has the offer
      if (product.offer.includes(offerId)) {
        continue;
      }
      // Update the product with the offer
      //   product.offer = offerId;
      product.offer.push(offerId);
      const updatedProduct = await product.save();
      updatedProducts.push(updatedProduct);
    }

    return res.status(200).send({
      message: "Offer added to products successfully",
      data: updatedProducts,
    });
  } catch (error) {
    return res.status(500).send({ message: "Failed to add offer to products" });
  }
};

const removeOfferFromProduct = async (req, res) => {
  const { productIds, offerId } = req.body;

  try {
    // Find the offer by its ID
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).send("Offer not found");
    }

    // Update each product to remove the offer
    const updatedProducts = [];

    for (const productId of productIds) {
      // Find the product by its ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }
      if (product.offer.includes(offerId)) {
        // Remove the offerId from the offers array of the product
        const index = product.offer.indexOf(offerId);
        if (index > -1) {
          product.offer.splice(index, 1);
        }

        const updatedProduct = await product.save();
        updatedProducts.push(updatedProduct);
      } else {
        continue;
      }
    }

    return res.status(200).send({
      message: "Offer removed from products successfully",
      data: updatedProducts,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to remove offer from products" });
  }
};

const deleteOffer = async (req, res) => {
  const offerId = req.params.offerId;

  try {
    // Find the offer by its ID
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).send("Offer not found");
    }

    // Find the products with the specified offer
    const products = await Product.find({ offer: offerId });

    if (products.length > 0) {
      // Remove the offer from the products
      for (const product of products) {
        product.offer = null;
        await product.save();
      }
    }
    // Delete the offer from the offer table
    await Offer.findByIdAndRemove(offerId);

    return res.status(200).send({
      message: "Offer deleted successfully",
      data: offer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Failed to delete offer" });
  }
};

const getOffers = async (req, res) => {
  try {
    // Retrieve all categories from the database
    console.log("enetered in here");
    const offers = await Offer.find();
    console.log(offers, offers);

    res.status(200).send(offers);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch categories" });
  }
};

module.exports = {
  createOffer,
  deleteOffer,
  addOfferToProduct,
  removeOfferFromProduct,
  getOffers,
};
