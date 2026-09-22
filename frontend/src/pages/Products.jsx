import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') ? Number(searchParams.get('category')) : null;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [keyword, setKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (keyword.trim()) params.keyword = keyword.trim();
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);

      const res = await productApi.getAll(params);
      let list = res.data;

      // In-memory sort
      if (sortBy === 'price-asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        list.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }

      setProducts(list);
    } catch (err) {
      console.error('Error fetching filtered products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setKeyword('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
          Farm Marketplace
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Buy fresh, chemical-free agricultural produce directly from verified farmers.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: 20, marginBottom: 28 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search produce (e.g. Tomato, Mango, Wheat)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
          </div>

          {/* Min Price */}
          <div style={{ width: 110 }}>
            <input
              type="number"
              className="form-control"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          {/* Max Price */}
          <div style={{ width: 110 }}>
            <input
              type="number"
              className="form-control"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {/* Sort Selector */}
          <div style={{ width: 160 }}>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Harvest Date</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
            Apply Filter
          </button>

          {(selectedCategory || keyword || minPrice || maxPrice) && (
            <button type="button" onClick={resetFilters} className="btn btn-secondary" style={{ padding: '10px 14px' }}>
              <RefreshCw size={16} /> Reset
            </button>
          )}
        </form>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={() => { setSelectedCategory(null); setSearchParams({}); }}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedCategory === null ? '#15803d' : '#f1f5f9',
              color: selectedCategory === null ? '#ffffff' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            All Categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { setSelectedCategory(cat.id); setSearchParams({ category: cat.id }); }}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat.id ? '#15803d' : '#f1f5f9',
                color: selectedCategory === cat.id ? '#ffffff' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Result */}
      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
          Searching farm inventory...
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌱</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
            No products match your criteria
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
            Try resetting your price filters or searching with another keyword.
          </p>
          <button onClick={resetFilters} className="btn btn-secondary" style={{ marginTop: 16 }}>
            View All Harvested Produce
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
