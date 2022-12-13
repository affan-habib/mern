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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
