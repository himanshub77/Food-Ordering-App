import "dotenv/config";
import mongoose from "mongoose";
import Food from "./models/Food.js";
import User from "./models/User.js";

// Unsplash Source is discontinued, so we use a simple placeholder image.
// The frontend will show an emoji fallback if an image fails to load.
const img = (text) =>
  `https://placehold.co/400x300/fff3e6/e65100?text=${encodeURIComponent(text)}`;

const foods = [
  { name: "Margherita Pizza", price: 249, category: "Pizza", isVeg: true, rating: 4.5, description: "Classic cheese and basil" },
  { name: "Pepperoni Pizza", price: 329, category: "Pizza", isVeg: false, rating: 4.4, description: "Loaded with pepperoni" },
  { name: "Veg Burger", price: 129, category: "Burgers", isVeg: true, rating: 4.1, description: "Crispy patty with fresh veggies" },
  { name: "Chicken Burger", price: 179, category: "Burgers", isVeg: false, rating: 4.3, description: "Juicy grilled chicken" },
  { name: "Paneer Butter Masala", price: 219, category: "Main Course", isVeg: true, rating: 4.6, description: "Creamy tomato gravy" },
  { name: "Chicken Biryani", price: 259, category: "Main Course", isVeg: false, rating: 4.7, description: "Hyderabadi style dum biryani" },
  { name: "Masala Dosa", price: 99, category: "South Indian", isVeg: true, rating: 4.5, description: "Crispy dosa with potato filling" },
  { name: "Idli Sambar", price: 69, category: "South Indian", isVeg: true, rating: 4.2, description: "Soft idlis with sambar" },
  { name: "Chocolate Brownie", price: 119, category: "Desserts", isVeg: true, rating: 4.6, description: "Warm fudgy brownie" },
  { name: "Gulab Jamun", price: 79, category: "Desserts", isVeg: true, rating: 4.4, description: "Soft syrupy dumplings" },
  { name: "Cold Coffee", price: 99, category: "Drinks", isVeg: true, rating: 4.3, description: "Chilled and creamy" },
  { name: "Fresh Lime Soda", price: 59, category: "Drinks", isVeg: true, rating: 4.0, description: "Sweet or salted" },
].map((f) => ({ ...f, image: img(f.name) }));

await mongoose.connect(process.env.MONGO_URI);
await Food.deleteMany();
await Food.insertMany(foods);

if (!(await User.findOne({ email: "admin@food.com" }))) {
  await User.create({
    name: "Admin",
    email: "admin@food.com",
    password: "admin123",
    role: "admin",
  });
}

console.log("Seeded 12 foods and admin user (admin@food.com / admin123)");
process.exit();
