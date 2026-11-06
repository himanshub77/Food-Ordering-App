import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, openCart } = useCart();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    show("Logged out");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">🍔 Foodie</Link>

        <nav className="nav-links">
          <NavLink to="/" end>Menu</NavLink>
          {user && <NavLink to="/orders">My Orders</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="nav-actions">
          <button className="cart-btn" onClick={openCart} aria-label="Open cart">
            🛒
            {count > 0 && (
              // key={count} restarts the CSS animation each time the number changes
              <span key={count} className="badge bump">{count}</span>
            )}
          </button>

          {user ? (
            <>
              <span className="hello">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-sm hide-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
