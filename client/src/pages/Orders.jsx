import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getError } from "../api";

const STEPS = [
  ["placed", "Placed"],
  ["preparing", "Preparing"],
  ["out_for_delivery", "On the way"],
  ["delivered", "Delivered"],
];

function Timeline({ status }) {
  if (status === "cancelled") return <div className="cancelled">❌ Order cancelled</div>;
  const current = STEPS.findIndex(([key]) => key === status);
  return (
    <div className="timeline">
      {STEPS.map(([key, label], i) => (
        <div key={key} className={`step ${i <= current ? "done" : ""} ${i === current ? "now" : ""}`}>
          <div className="dot">{i < current ? "✓" : i + 1}</div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () =>
      api
        .get("/orders/mine")
        .then((r) => setOrders(r.data))
        .catch((e) => setError(getError(e)))
        .finally(() => setLoading(false));

    load();
    const timer = setInterval(load, 8000); // refresh so status updates appear live
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="container page"><div className="sk sk-line w60" /><div className="sk sk-block" /></div>;

  return (
    <div className="container page">
      <h1>My Orders</h1>
      {error && <div className="alert">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📦</div>
          <p>You haven't ordered anything yet.</p>
          <Link to="/" className="btn">Order now</Link>
        </div>
      ) : (
        orders.map((o) => (
          <div className="panel order" key={o._id}>
            <div className="order-head">
              <div>
                <strong>Order #{o._id.slice(-6).toUpperCase()}</strong>
                <div className="muted small">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <strong className="price">₹{o.total}</strong>
            </div>

            <Timeline status={o.status} />

            <ul className="order-items">
              {o.items.map((i, idx) => (
                <li key={idx}>{i.name} × {i.qty} <span>₹{i.price * i.qty}</span></li>
              ))}
            </ul>
            <div className="muted small">📍 {o.address}</div>
          </div>
        ))
      )}
    </div>
  );
}
