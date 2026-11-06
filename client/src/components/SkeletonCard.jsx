// Grey shimmering placeholder shown while the menu is loading
export default function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="sk sk-img" />
      <div className="card-body">
        <div className="sk sk-line w60" />
        <div className="sk sk-line w90" />
        <div className="sk sk-line w40" />
      </div>
    </div>
  );
}
