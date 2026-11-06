// The  [ - 2 + ]  quantity control used on cards and in the cart.
export default function Stepper({ qty, onInc, onDec }) {
  return (
    <div className="stepper">
      <button onClick={onDec} aria-label="Decrease quantity">−</button>
      <span key={qty} className="stepper-qty">{qty}</span>
      <button onClick={onInc} aria-label="Increase quantity">+</button>
    </div>
  );
}
