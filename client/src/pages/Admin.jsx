import { useEffect, useState } from "react";
import api, { getError } from "../api";
import { useToast } from "../context/ToastContext";

const STATUSES = ["placed", "preparing", "out_for_delivery", "delivered", "cancelled"];
const emptyFood = { name: "", description: "", price: "", category: "", image: "", isVeg: true };

export default function Admin() {
  const { show } = useToast();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(emptyFood);

  const loadOrders = () =>
    api.get("/orders").then((r) => setOrders(r.data)).catch((e) => show(getError(e), "error"));
  const loadFoods = () =>
    api.get("/foods", { params: { limit: 50 } }).then((r) => setFoods(r.data.items)).catch(() => {});

  useEffect(() => {
    loadOrders();
    loadFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders((list) => list.map((o) => (o._id === id ? { ...o, status } : o)));
      show("Status updated");
    } catch (e) {
      show(getError(e), "error");
    }
  };

  const addFood = async (e) => {
    e.preventDefault();
    try {
      await api.post("/foods", { ...form, price: Number(form.price) });
      show("Food added");
      setForm(emptyFood);
      loadFoods();
    } catch (err) {
      show(getError(err), "error");
    }
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.delete(`/foods/${id}`);
      setFoods((l) => l.filter((f) => f._id !== id));
      show("Deleted");
    } catch (e) {
      show(getError(e), "error");
    }
  };

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="container page">
      <h1>Admin Panel</h1>
      <div className="chips">
        <button className={`chip ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>
          Orders ({orders.length})
        </button>
        <button className={`chip ${tab === "menu" ? "active" : ""}`} onClick={() => setTab("menu")}>
          Menu ({foods.length})
        </button>
      </div>

      {tab === "orders" && (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-6).toUpperCase()}</td>
                  <td>{o.user?.name || "—"}<div className="muted small">{o.user?.email}</div></td>
                  <td>{o.items.map((i) => `${i.name}×${i.qty}`).join(", ")}</td>
                  <td>₹{o.total}</td>
                  <td>
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="muted center">No orders yet.</p>}
        </div>
      )}

      {tab === "menu" && (
        <div className="checkout-grid">
          <form className="panel" onSubmit={addFood}>
            <h3>Add new item</h3>
            <input name="name" required placeholder="Name" value={form.name} onChange={set} />
            <input name="category" required placeholder="Category (e.g. Pizza)" value={form.category} onChange={set} />
            <input name="price" required type="number" min="0" placeholder="Price" value={form.price} onChange={set} />
            <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={set} />
            <textarea name="description" rows="2" placeholder="Description" value={form.description} onChange={set} />
            <label className="radio">
              <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />
              Vegetarian
            </label>
            <button className="btn btn-block">Add item</button>
          </form>

          <div className="panel">
            <h3>Current menu</h3>
            {foods.map((f) => (
              <div className="row" key={f._id}>
                <span>{f.name} <span className="muted">· ₹{f.price}</span></span>
                <button className="link-btn danger" onClick={() => deleteFood(f._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
