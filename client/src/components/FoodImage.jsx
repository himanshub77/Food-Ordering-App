import { useState } from "react";

// Shows the image, or a big emoji if the image fails to load
export default function FoodImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed)
    return <div className={`img-fallback ${className}`}>🍽️</div>;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
