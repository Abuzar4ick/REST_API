const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", OrderSchema)
module.exports = Order