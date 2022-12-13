const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add a name value"],
    },
    contactNumber: {
      type: String,
      required: [true, "Please add a name value"],
    },
    gender: {
      type: String,
      required: [true, "Please add a name value"],
    },
    age: {
      type: Number,
      required: [true, "Please add a name value"],
    },
    orderDetailList: {
      type: Array,
    },
    total: {
      type: Number,
      required: [true, "Please add a basePrice value"],
    },
    discount: {
      type: Number,
      required: [true, "Please add a basePrice value"],
    },
    advance: {
      type: Number,
      required: [true, "Please add a basePrice value"],
    },
    due: {
      type: Number,
      required: [true, "Please add a basePrice value"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
