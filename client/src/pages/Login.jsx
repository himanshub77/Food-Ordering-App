import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getError } from "../api";

export default function Login() {
  const { login } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      show(`Welcome back, ${u.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      show(getError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2>Welcome back 👋</h2>
        <p className="muted">Login to order your favourite food</p>

        <label>Email</label>
        <input name="email" type="email" required value={form.email} onChange={change} placeholder="you@example.com" />

        <label>Password</label>
        <input name="password" type="password" required value={form.password} onChange={change} placeholder="••••••" />

        <button className="btn btn-block" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="muted center">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
