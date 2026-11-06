import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const payload = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  token: sign(u._id),
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json(payload(user));
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json(payload(user));
  } catch (e) {
    next(e);
  }
});

router.get("/me", protect, (req, res) => res.json(req.user));

export default router;
