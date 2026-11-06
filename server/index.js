import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import foodRoutes from "./routes/foods.js";
import orderRoutes from "./routes/orders.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() =>
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  )
);
