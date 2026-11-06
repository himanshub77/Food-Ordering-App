import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getError } from "../api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const DELIVERY_FEE = 30;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { show } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("upi");
  const [stage, setStage] = useState("form"); // form | paying | success

  if (items.length === 0 && stage === "form") {
    return (
      <div className="container empty page">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn">Browse menu</Link>
      </div>
    );
  }

  const gst = Math.round(total * 0.05);
  const grand = total + gst + DELIVERY_FEE;

  const placeOrder = async (e) => {
    e.preventDefault();
    if (address.trim().length < 10) return show("Please enter a full delivery address", "error");

    try {
      // Simulated payment (no real money involved)
      if (method !== "cod") {
        setStage("paying");
        await sleep(2200);
      }

      // The server recalculates prices from the database for safety
      await api.post("/orders", {
        items: items.map((i) => ({ foodId: i._id, qty: i.qty })),
        address: address.trim(),
      });

      setStage("success");
      clear();
      await sleep(1600);
      show("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      setStage("form");
      show(getError(err), "error");
    }
  };

  return (
    <div className="container page checkout">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <form className="panel" onSubmit={placeOrder}>
          <h3>Delivery address</h3>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Flat no, building, street, city, pincode"
          />

          <h3>Payment method</h3>
          {[
            ["upi", "📱 UPI (simulated)"],
            ["card", "💳 Credit / Debit card (simulated)"],
            ["cod", "💵 Cash on delivery"],
          ].map(([val, label]) => (
            <label key={val} className={`radio ${method === val ? "selected" : ""}`}>
              <input type="radio" name="pay" checked={method === val} onChange={() => setMethod(val)} />
              {label}
            </label>
          ))}

          <button className="btn btn-block" disabled={stage !== "form"}>
            {method === "cod" ? "Place order" : `Pay ₹${grand}`}
          </button>
          <p className="muted center small">Demo project: no real payment is taken.</p>
        </form>

        <div className="panel">
          <h3>Order summary</h3>
          {items.map((i) => (
            <div className="row" key={i._id}>
              <span>{i.name} × {i.qty}</span>
              <span>₹{i.price * i.qty}</span>
            </div>
          ))}
          <hr />
          <div className="row"><span>Subtotal</span><span>₹{total}</span></div>
          <div className="row"><span>GST (5%)</span><span>₹{gst}</span></div>
          <div className="row"><span>Delivery fee</span><span>₹{DELIVERY_FEE}</span></div>
          <hr />
          <div className="row grand"><span>To pay</span><span>₹{grand}</span></div>
        </div>
      </div>

      {stage !== "form" && (
        <div className="modal-bg">
          <div className="modal">
            {stage === "paying" ? (
              <>
                <div className="spinner" />
                <h3>Processing payment...</h3>
                <p className="muted">Please don't close this window</p>
              </>
            ) : (
              <>
                <div className="tick">✓</div>
                <h3>Order confirmed!</h3>
                <p className="muted">Taking you to your orders...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
