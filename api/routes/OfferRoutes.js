const express = require("express");
const router = express.Router();
const offerController = require("../controllers/OffersControllers");

// Route: Create a new offer
router.post("/createoffer", offerController.createOffer);

// add offers to products
router.post("/addoffer", offerController.addOfferToProduct);

// remove offers form the products
router.put("/removeoffer", offerController.removeOfferFromProduct);

// delete offer
router.delete("/deleteoffer/:offerId", offerController.deleteOffer);

// get offers
router.get("/view/offers", offerController.getOffers);

module.exports = router;
