const express = require("express");
const router = express.Router();
const penModelController = require("../controllers/PenModelContollers");
const authenticate = require("../Middlewares/auth");

// Create a new Model
router.post("/add", authenticate, penModelController.createModel);

// Update an existing Model
router.put("/update/:modelId", authenticate, penModelController.updateModel);

// Delete an existing Model
router.delete("/delete/:modelId", authenticate, penModelController.deleteModel);

// Get all Models
router.get("/getmodel", penModelController.getAllModels);

// get single Model by id
router.get("/get/:modelId", penModelController.getModelById);

module.exports = router;
