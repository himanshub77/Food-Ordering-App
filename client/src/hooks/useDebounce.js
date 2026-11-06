import { useEffect, useState } from "react";

// Returns `value` only after the user stops changing it for `delay` ms.
// Used so we don't call the API on every single keystroke.
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
