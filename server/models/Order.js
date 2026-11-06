import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        name: String,
        price: Number,
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["placed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
