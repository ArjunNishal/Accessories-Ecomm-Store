const User = require("../models/usersSchema");

const addToFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the product is already in favorites
    const isProductInFavorites = user.favorites.includes(productId);

    if (isProductInFavorites) {
      return res.status(400).send("Product already in favorites");
    }

    // Add the product to favorites
    user.favorites.push(productId);
    await user.save();

    return res.status(200).send("Product added to favorites");
  } catch (error) {
    return res.status(500).send("Failed to add product to favorites");
  }
};

const removeFromFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the product is in favorites
    const isProductInFavorites = user.favorites.includes(productId);

    if (!isProductInFavorites) {
      return res.status(400).send("Product not found in favorites");
    }

    // Remove the product from favorites
    user.favorites.pull(productId);
    await user.save();

    return res.status(200).send("Product removed from favorites");
  } catch (error) {
    return res.status(500).send("Failed to remove product from favorites");
  }
};

const getAllFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).send("User not found");
    }
    // Retrieve all favorite products
    const favoriteProducts = user.favorites;

    return res.status(200).send(favoriteProducts);
  } catch (error) {
    return res.status(500).send("Failed to get favorite items");
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getAllFavorites,
};
