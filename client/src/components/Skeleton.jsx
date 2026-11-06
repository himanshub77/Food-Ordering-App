// Grey shimmering placeholder shown while the menu is loading.
export default function FoodCardSkeleton() {
  return (
    <div className="card food-card" aria-hidden="true">
      <div className="sk sk-img" />
      <div className="food-body">
        <div className="sk sk-line w60" />
        <div className="sk sk-line" />
        <div className="sk sk-line w40" />
      </div>
    </div>
  );
}
