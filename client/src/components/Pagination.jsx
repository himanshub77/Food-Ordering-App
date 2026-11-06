export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const numbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>← Prev</button>
      {numbers.map((n) => (
        <button
          key={n}
          className={n === page ? "active" : ""}
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
        >
          {n}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>Next →</button>
    </nav>
  );
}
