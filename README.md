# 🍔 Foodie: Full-Stack Food Ordering App

A full-stack food ordering web application built with the **MERN stack** (MongoDB, Express, React, Node.js). Users can browse a menu, search and filter dishes, build a cart, check out, and track their orders. Admins can manage the menu and update order status.


## Features

**Customers**
- Register and login with JWT authentication
- Search dishes (multi-word, any order), filter by category, veg-only toggle, sort by price or rating
- Server-side pagination and loading skeletons
- Slide-in cart with quantity controls, saved in the browser so it survives a refresh
- Checkout with delivery address and a simulated payment flow (UPI, card, cash on delivery)
- Order history with a live status timeline (placed → preparing → on the way → delivered)

**Admin**
- Add and delete menu items
- View all orders and update their status

**Engineering highlights**
- Passwords hashed with bcrypt; protected routes and role-based access (user / admin)
- Order totals are calculated on the server from database prices, never trusted from the client
- Debounced search to reduce unnecessary API calls
- Central error handling, MVC-style folder structure, environment variables for secrets
- Context API with `useReducer` for cart state; axios interceptor attaches the token to every request
- Responsive layout, toast notifications and animations

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router, Axios, Context API, plain CSS |
| Backend | Node.js, Express, JWT, bcryptjs,  |
| Database | MongoDB, Mongoose |
| Tools | Git, GitHub, VS Code, |

## Project Structure

```
food-app/
├── client/                  # React frontend
│   ├── public/images/       # Dish photos
│   └── src/
│       ├── components/      # Navbar, FoodCard, CartDrawer, ...
│       ├── context/         # Auth, Cart, Toast providers
│       ├── hooks/           # useDebounce
│       ├── pages/           # Home, Login, Register, Checkout, Orders, Admin
│       └── api.js           # Axios instance + interceptors
└── server/                  # Express backend
    ├── config/              # Database connection
    ├── middleware/          # Auth and error handling
    ├── models/              # User, Food, Order
    ├── routes/              # auth, foods, orders
    ├── seed.js              # Sample data + admin user
    └── index.js
```

## Getting Started

**Prerequisites:** Node.js (LTS) and a MongoDB database (local or free MongoDB Atlas cluster).

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/food-ordering-app.git
cd food-ordering-app
```

### 2. Set up the server
```bash
cd server
npm install
```
Create a `.env` file in `server/` (see `.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```
Add sample data and start the server:
```bash
npm run seed
npm run dev
```

### 3. Set up the client
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

### Admin login (created by the seed script)
```
Email:    admin@food.com
Password: admin123
```
Change this password before deploying anywhere public.

## API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/me` | User | Get the logged-in user |
| GET | `/api/foods` | Public | List foods (`search`, `category`, `veg`, `sort`, `page`, `limit`) |
| GET | `/api/foods/categories` | Public | List categories |
| POST / PUT / DELETE | `/api/foods`, `/api/foods/:id` | Admin | Manage menu items |
| POST | `/api/orders` | User | Place an order |
| GET | `/api/orders/mine` | User | Get my orders |
| GET | `/api/orders` | Admin | Get all orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

## Future Improvements
- Real-time order updates with Socket.io
- Razorpay payment integration (test mode)
- Reviews, ratings and coupon codes
- Multiple restaurants and image uploads with Cloudinary
- Automated tests with Jest and Supertest

## Author
**Your Name** — [GitHub](https://github.com/himanshub77) · [LinkedIn](https://www.linkedin.com/in/himanshu-bhavsar-5b50353a4/)
