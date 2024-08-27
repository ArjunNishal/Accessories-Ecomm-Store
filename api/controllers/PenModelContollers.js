const Model = require("../models/PenModelSchema");

// Create a new Model
const createModel = async (req, res) => {
  try {
    const { name } = req.body;
    const model = new Model({ name });
    await model.save();
    res.status(200).json(model);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create Model" });
  }
};

// Update an existing Model
const updateModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    const { name } = req.body;

    const model = await Model.findByIdAndUpdate(
      modelId,
      { name },
      { new: true }
    );
    if (!model) {
      return res.status(500).json({ error: "Model not found" });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ error: "Failed to update Model" });
  }
};

// Delete an existing Model
const deleteModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = await Model.findByIdAndRemove(modelId);
    if (!model) {
      return res.status(500).json({ error: "Model not found" });
    }
    res.status(200).json({ message: "Model deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Model" });
  }
};

const getAllModels = async (req, res) => {
  try {
    const models = await Model.find();
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Models" });
  }
};
const getModelById = async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(500).json({ error: "Model not found" });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Model" });
  }
};

module.exports = {
  createModel,
  getModelById,
  updateModel,
  getAllModels,
  deleteModel,
};
