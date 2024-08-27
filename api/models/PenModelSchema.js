const mongoose = require("mongoose");

const penModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Model = mongoose.model("Model", penModelSchema);

module.exports = Model;
