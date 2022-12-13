const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    orderDetailList: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
