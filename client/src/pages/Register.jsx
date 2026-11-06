import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getError } from "../api";

export default function Register() {
  const { register } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return show("Password must be at least 6 characters", "error");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      show("Account created!");
      navigate("/");
    } catch (err) {
      show(getError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2>Create account 🍽️</h2>
        <p className="muted">It takes less than a minute</p>

        <label>Name</label>
        <input name="name" required value={form.name} onChange={change} placeholder="Your name" />

        <label>Email</label>
        <input name="email" type="email" required value={form.email} onChange={change} placeholder="you@example.com" />

        <label>Password</label>
        <input name="password" type="password" required value={form.password} onChange={change} placeholder="At least 6 characters" />

        <button className="btn btn-block" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="muted center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
