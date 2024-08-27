const Charm = require("../models/CharmSchema");

// Create a new charm
const createCharm = async (req, res) => {
  try {
    const { name, index } = req.body;

    // Check if charm with the same index already exists
    const existingCharm = await Charm.findOne({ index });
    if (existingCharm) {
      return res
        .status(500)
        .json({ error: "Charm with the same index already exists" });
    }

    const charm = new Charm({ name, index });
    await charm.save();
    res.status(200).json(charm);
  } catch (error) {
    res.status(500).json({ error: "Failed to create charm" });
  }
};

// Update an existing charm
const updateCharm = async (req, res) => {
  try {
    const { charmId } = req.params;
    const { name, index } = req.body;

    // Check if charm with the same index already exists
    const existingCharm = await Charm.findOne({ index, _id: { $ne: charmId } });
    if (existingCharm) {
      return res
        .status(500)
        .json({ error: "Charm with the same index already exists" });
    }

    const charm = await Charm.findByIdAndUpdate(
      charmId,
      { name, index },
      { new: true }
    );
    if (!charm) {
      return res.status(500).json({ error: "Charm not found" });
    }
    res.status(200).json(charm);
  } catch (error) {
    res.status(500).json({ error: "Failed to update charm" });
  }
};

// Delete an existing charm
const deleteCharm = async (req, res) => {
  try {
    const { charmId } = req.params;
    const charm = await Charm.findByIdAndRemove(charmId);
    if (!charm) {
      return res.status(500).json({ error: "Charm not found" });
    }
    res.status(200).json({ message: "Charm deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete charm" });
  }
};

const getAllCharms = async (req, res) => {
  try {
    const charms = await Charm.find();
    res.status(200).json(charms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch charms" });
  }
};
const getCharmById = async (req, res) => {
  try {
    const { charmId } = req.params;
    const charm = await Charm.findById(charmId);
    if (!charm) {
      return res.status(500).json({ error: "Charm not found" });
    }
    res.status(200).json(charm);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch charm" });
  }
};

module.exports = {
  createCharm,
  getCharmById,
  updateCharm,
  getAllCharms,
  deleteCharm,
};
