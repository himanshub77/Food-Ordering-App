import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FoodImage from "./FoodImage";

export default function CartDrawer() {
  const { items, total, open, closeCart, inc, dec, remove, clear } = useCart();
  const { user } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const checkout = () => {
    closeCart();
    if (!user) {
      show("Please login to checkout", "error");
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={closeCart} />
      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <h2>Your Cart</h2>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <button className="btn btn-outline" onClick={closeCart}>Browse menu</button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((i) => (
                <div className="cart-row" key={i._id}>
                  <FoodImage src={i.image} alt={i.name} className="cart-img" />
                  <div className="cart-info">
                    <strong>{i.name}</strong>
                    <span className="muted">₹{i.price} each</span>
                    <div className="stepper small">
                      <button onClick={() => dec(i._id)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => inc(i._id)}>+</button>
                    </div>
                  </div>
                  <div className="cart-right">
                    <strong>₹{i.price * i.qty}</strong>
                    <button className="link-btn" onClick={() => remove(i._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-foot">
              <div className="row"><span>Total</span><strong>₹{total}</strong></div>
              <button className="btn btn-block" onClick={checkout}>Proceed to Checkout</button>
              <button className="link-btn center" onClick={clear}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
