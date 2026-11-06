import { useEffect, useState } from "react";
import api, { getError } from "../api";
import useDebounce from "../hooks/useDebounce";
import FoodCard from "../components/FoodCard";
import SkeletonCard from "../components/SkeletonCard";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [veg, setVeg] = useState(false);
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  // Load categories once
  useEffect(() => {
    api.get("/foods/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  // Whenever a filter changes, go back to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, veg, sort]);

  // Load foods whenever any filter or the page changes
  useEffect(() => {
    let cancelled = false; // ignore old responses if filters changed quickly
    setLoading(true);
    setError("");

    api
      .get("/foods", {
        params: { search: debouncedSearch, category, veg, sort, page, limit: 8 },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setFoods(data.items);
        setPages(data.pages);
        setTotal(data.total);
      })
      .catch((e) => !cancelled && setError(getError(e)))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, veg, sort, page]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Hungry? We've got you. 🍕</h1>
          <p>Fresh food from your favourite kitchens, delivered fast.</p>
          <div className="search-box">
            <span>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for pizza, biryani, dosa..."
            />
            {search && (
              <button className="icon-btn" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
            )}
          </div>
        </div>
      </section>

      <div className="container page">
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="toolbar">
          <label className="switch">
            <input type="checkbox" checked={veg} onChange={(e) => setVeg(e.target.checked)} />
            <span className="slider" />
            <span>Veg only</span>
          </label>

          <span className="muted">{loading ? "Loading..." : `${total} items`}</span>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name">Sort: Name</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {error && (
          <div className="alert">
            {error}. Is the server running on port 5000?
          </div>
        )}

        <div className="grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : foods.map((f) => <FoodCard key={f._id} food={f} />)}
        </div>

        {!loading && !error && foods.length === 0 && (
          <div className="empty">
            <div className="empty-icon">😕</div>
            <p>No dishes match your search.</p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setVeg(false);
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              ← Prev
            </button>
            <span>Page {page} of {pages}</span>
            <button className="btn btn-outline btn-sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
