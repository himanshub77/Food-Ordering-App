import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// The reducer holds ALL cart logic in one place
function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const f = action.food;
      const exists = state.find((i) => i._id === f._id);
      if (exists)
        return state.map((i) => (i._id === f._id ? { ...i, qty: i.qty + 1 } : i));
      return [
        ...state,
        { _id: f._id, name: f.name, price: f.price, image: f.image, isVeg: f.isVeg, qty: 1 },
      ];
    }
    case "INC":
      return state.map((i) => (i._id === action.id ? { ...i, qty: i.qty + 1 } : i));
    case "DEC":
      return state
        .map((i) => (i._id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
    case "REMOVE":
      return state.filter((i) => i._id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], load);
  const [open, setOpen] = useState(false);

  // Save the cart so it survives a page refresh
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((n, i) => n + i.qty * i.price, 0), [items]);

  const value = {
    items,
    count,
    total,
    open,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    add: (food) => dispatch({ type: "ADD", food }),
    inc: (id) => dispatch({ type: "INC", id }),
    dec: (id) => dispatch({ type: "DEC", id }),
    remove: (id) => dispatch({ type: "REMOVE", id }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
