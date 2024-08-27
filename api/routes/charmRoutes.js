const express = require("express");
const router = express.Router();
const charmController = require("../controllers/CharmContollers");
const authenticate = require("../Middlewares/auth");

// Create a new charm
router.post("/add", authenticate, charmController.createCharm);

// Update an existing charm
router.put("/update/:charmId", authenticate, charmController.updateCharm);

// Delete an existing charm
router.delete("/delete/:charmId", authenticate, charmController.deleteCharm);

// Get all charms
router.get("/getcharm", charmController.getAllCharms);

// get single charm by id
router.get("/get/:charmId", charmController.getCharmById);

module.exports = router;
