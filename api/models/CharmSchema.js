const mongoose = require("mongoose");

const charmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Charm = mongoose.model("Charm", charmSchema);

module.exports = Charm;
