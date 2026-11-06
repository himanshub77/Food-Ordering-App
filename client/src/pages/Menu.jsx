import { useEffect, useState } from "react";
import api, { errMsg } from "../api.js";
import useDebounce from "../hooks/useDebounce.js";
import FoodCard from "../components/FoodCard.jsx";
import FoodCardSkeleton from "../components/Skeleton.jsx";
import Pagination from "../components/Pagination.jsx";

const LIMIT = 8;

export default function Menu() {
  const [categories, setCategories] = useState(["All"]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [veg, setVeg] = useState(false);
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Wait until the user stops typing for 400ms before searching.
  const debouncedSearch = useDebounce(search, 400);

  // Load the category chips once.
  useEffect(() => {
    api.get("/foods/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  // Load foods whenever a filter or the page changes.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    api
      .get("/foods", {
        params: {
          search: debouncedSearch || undefined,
          category,
          veg: veg || undefined,
          sort,
          page,
          limit: LIMIT,
        },
        signal: controller.signal,
      })
      .then((res) => setData(res.data))
      .catch((e) => {
        if (controller.signal.aborted) return; // request was cancelled, ignore
        setError(errMsg(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    // Cleanup: cancel the old request if a new one starts (prevents race bugs).
    return () => controller.abort();
  }, [debouncedSearch, category, veg, sort, page, reloadKey]);

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setVeg(false);
    setSort("name");
    setPage(1);
  };

  const filtersActive = search || category !== "All" || veg || sort !== "name";

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Hungry? Get it delivered.</h1>
          <p>Fresh, hot and fast. Pick your favourites and we'll handle the rest.</p>
          <div className="search-box">
            <span>🔍</span>
            <input
              type="search"
              placeholder="Search for pizza, biryani, dosa…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search food"
            />
          </div>
        </div>
      </section>

      <div className="filters">
        <div className="container filters-inner">
          <div className="chips">
            {categories.map((c) => (
              <button
                key={c}
                className={`chip ${c === category ? "active" : ""}`}
                onClick={() => {
                  setCategory(c);
                  setPage(1);
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="filter-controls">
            <label className="switch">
              <input
                type="checkbox"
                checked={veg}
                onChange={(e) => {
                  setVeg(e.target.checked);
                  setPage(1);
                }}
              />
              <span className="slider" />
              <span>Veg only</span>
            </label>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              aria-label="Sort by"
            >
              <option value="name">Sort: Name</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container section">
        {!loading && !error && (
          <p className="muted result-count">
            {data.total} {data.total === 1 ? "dish" : "dishes"} found
          </p>
        )}

        {error ? (
          <div className="empty">
            <div className="empty-icon">⚠️</div>
            <h3>Couldn't load the menu</h3>
            <p className="muted">{error}</p>
            <button className="btn" onClick={() => setReloadKey((k) => k + 1)}>Try again</button>
          </div>
        ) : loading ? (
          <div className="grid">
            {Array.from({ length: LIMIT }, (_, i) => <FoodCardSkeleton key={i} />)}
          </div>
        ) : data.items.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🍽️</div>
            <h3>No dishes found</h3>
            <p className="muted">Try a different search or filter.</p>
            {filtersActive && <button className="btn" onClick={clearFilters}>Clear filters</button>}
          </div>
        ) : (
          <>
            <div className="grid">
              {data.items.map((food, i) => (
                <FoodCard key={food._id} food={food} index={i} />
              ))}
            </div>
            <Pagination page={data.page ?? page} pages={data.pages} onChange={changePage} />
          </>
        )}
      </div>
    </>
  );
}
