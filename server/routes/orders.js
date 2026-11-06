import { Router } from "express";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// Place an order. Prices are read from the database, never from the client.
router.post("/", protect, async (req, res, next) => {
  try {
    const { items, address } = req.body; // items: [{ foodId, qty }]
    if (!Array.isArray(items) || items.length === 0 || !address)
      return res.status(400).json({ message: "Items and address are required" });

    const foods = await Food.find({ _id: { $in: items.map((i) => i.foodId) } });
    const map = new Map(foods.map((f) => [String(f._id), f]));

    let total = 0;
    const orderItems = items.map((i) => {
      const f = map.get(String(i.foodId));
      if (!f) throw Object.assign(new Error("Invalid item in cart"), { status: 400 });
      const qty = Math.max(1, Number(i.qty) || 1);
      total += f.price * qty;
      return { food: f._id, name: f.name, price: f.price, qty };
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      address,
    });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

// Logged-in user's own orders
router.get("/mine", protect, async (req, res, next) => {
  try {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});

// Admin: all orders
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    res.json(
      await Order.find().populate("user", "name email").sort({ createdAt: -1 })
    );
  } catch (e) {
    next(e);
  }
});

// Admin: update status
router.patch("/:id/status", protect, adminOnly, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (e) {
    next(e);
  }
});

export default router;
