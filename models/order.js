const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    id: {
      type: String,
      required: [true, "Please add a id value"],
    },
    name: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: [true, "Please add a contactNumber value"],
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
    },
    itemList: {
      type: Array,
    },
    paid: {
      type: Boolean,
    },
    total: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    paidAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
