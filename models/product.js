const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Please add a serviceName value"],
    },
    basePrice: {
      type: Number,
      required: [true, "Please add a basePrice value"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
