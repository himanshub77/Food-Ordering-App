import { Router } from "express";
import Food from "../models/Food.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// GET /api/foods?search=pizza&category=Pizza&veg=true&sort=price_asc&page=1&limit=8
router.get("/", async (req, res, next) => {
  try {
    const { search, category, veg, sort = "name", page = 1, limit = 8 } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category;
    if (veg === "true") filter.isVeg = true;

    const sortMap = {
      name: { name: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
    };

    const p = Math.max(1, Number(page));
    const l = Math.min(50, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Food.find(filter)
        .sort(sortMap[sort] || sortMap.name)
        .skip((p - 1) * l)
        .limit(l),
      Food.countDocuments(filter),
    ]);

    res.json({ items, total, page: p, pages: Math.ceil(total / l) });
  } catch (e) {
    next(e);
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    res.json(["All", ...(await Food.distinct("category"))]);
  } catch (e) {
    next(e);
  }
});

router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    res.status(201).json(await Food.create(req.body));
  } catch (e) {
    next(e);
  }
});

router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
});

export default router;
