const express = require("express");
const router = express.Router();
const favItemController = require("../controllers/FavitemsControllers");

router.post("/addtofavorites", favItemController.addToFavorites);

router.post("/removefromfavorites", favItemController.removeFromFavorites);

router.get("/favorites/:userId", favItemController.getAllFavorites);

module.exports = router;
