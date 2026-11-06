import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import FoodImage from "./FoodImage";

export default function FoodCard({ food }) {
  const { items, add, inc, dec } = useCart();
  const { show } = useToast();
  const inCart = items.find((i) => i._id === food._id);

  const handleAdd = () => {
    add(food);
    show(`${food.name} added to cart`);
  };

  return (
    <div className="card food-card">
      <div className="img-wrap">
        <FoodImage src={food.image} alt={food.name} />
        <span className={`veg-dot ${food.isVeg ? "veg" : "nonveg"}`} title={food.isVeg ? "Veg" : "Non-veg"} />
        <span className="rating">⭐ {food.rating.toFixed(1)}</span>
      </div>

      <div className="card-body">
        <h3>{food.name}</h3>
        <p className="muted">{food.description}</p>

        <div className="card-footer">
          <span className="price">₹{food.price}</span>

          {inCart ? (
            <div className="stepper">
              <button onClick={() => dec(food._id)} aria-label="Decrease">−</button>
              <span>{inCart.qty}</span>
              <button onClick={() => inc(food._id)} aria-label="Increase">+</button>
            </div>
          ) : (
            <button className="btn btn-sm" onClick={handleAdd}>Add +</button>
          )}
        </div>
      </div>
    </div>
  );
}
