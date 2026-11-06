import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    image: { type: String, default: "" },
    isVeg: { type: Boolean, default: true },
    rating: { type: Number, default: 4, min: 0, max: 5 },
  },
  { timestamps: true }
);

foodSchema.index({ name: "text", description: "text" });

export default mongoose.model("Food", foodSchema);
