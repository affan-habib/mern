const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    id: {
      type: String,
      required: [true, "Please add a id value"],
    },
    serviceName: {
      type: String,
      required: [true, "Please add a name value"],
    },
    basePrice: {
      type: Number,
      required: [true, "Please add a basePrice value"],
    },
    discountPerUnit: {
      type: Number,
      required: [true, "Please add a gender value"],
    },
    expiryDate: {
      type: Number,
      required: [true, "Please add a contactNumber value"],
    },
    vatPerUnit: {
      type: Number,
      required: [true, "Please add a contactNumber value"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
