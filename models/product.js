const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
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
