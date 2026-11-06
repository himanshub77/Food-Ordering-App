import { useState } from "react";
import { money, sleep } from "../utils.js";
import { errMsg } from "../api.js";

const METHODS = [
  { id: "upi", label: "UPI", icon: "📱", hint: "Pay with any UPI app" },
  { id: "card", label: "Credit / Debit card", icon: "💳", hint: "Visa, Mastercard, RuPay" },
  { id: "cod", label: "Cash on delivery", icon: "💵", hint: "Pay when food arrives" },
];

// A FAKE payment screen for demo purposes. No real money moves.
// onConfirm(method) should create the order and return a promise.
// onDone() runs after the success animation.
export default function PaymentModal({ amount, onConfirm, onDone, onClose }) {
  const [method, setMethod] = useState("upi");
  const [stage, setStage] = useState("choose"); // choose | processing | done | error
  const [error, setError] = useState("");

  const pay = async () => {
    setStage("processing");
    setError("");
    try {
      if (method !== "cod") await sleep(1800); // pretend the bank is thinking
      await onConfirm(method);
      setStage("done");
      await sleep(1100);
      onDone();
    } catch (e) {
      setError(errMsg(e));
      setStage("error");
    }
  };

  const busy = stage === "processing" || stage === "done";

  return (
    <div className="modal-backdrop" onClick={() => !busy && onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {stage === "processing" && (
          <div className="modal-center">
            <div className="spinner" />
            <h3>Processing payment…</h3>
            <p className="muted">Please don't close this window</p>
          </div>
        )}

        {stage === "done" && (
          <div className="modal-center">
            <div className="success-tick">✓</div>
            <h3>Order placed!</h3>
            <p className="muted">Taking you to your orders…</p>
          </div>
        )}

        {(stage === "choose" || stage === "error") && (
          <>
            <div className="row between">
              <h3>Choose payment method</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <p className="demo-note">Demo only. No real payment is processed.</p>

            <div className="methods">
              {METHODS.map((m) => (
                <label key={m.id} className={`method ${method === m.id ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="method"
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                  />
                  <span className="method-icon">{m.icon}</span>
                  <span>
                    <strong>{m.label}</strong>
                    <small className="muted">{m.hint}</small>
                  </span>
                </label>
              ))}
            </div>

            {stage === "error" && <div className="alert">{error}</div>}

            <button className="btn btn-block" onClick={pay}>
              {method === "cod" ? "Place order" : `Pay ${money(amount)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
