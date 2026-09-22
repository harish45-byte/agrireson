import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { 
  Sprout, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight, 
  Coins, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll()
        ]);
        setProducts(prodRes.data.slice(0, 4));
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #15803d 50%, #16a34a 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '60px 40px',
        marginBottom: 48,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 680, position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: 20
          }}>
            <Sprout size={16} /> 🌾 Next-Gen Agricultural Commerce &amp; Profit Engine
          </div>

          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 16
          }}>
            Connecting Farmers Directly With Conscious Buyers
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: '#e2e8f0',
            marginBottom: 32
          }}>
            Empower cultivators to record input expenses, eliminate middlemen, and view real-time profit &amp; loss dashboards for every harvested crop.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Link to="/products" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 700 }}>
              <ShoppingBag size={18} /> Shop Fresh Harvest
            </Link>
            <Link to="/farmer/dashboard" className="btn" style={{
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 700
            }}>
              <TrendingUp size={18} /> Farmer Profit Hub <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Explore Categories
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Fresh, certified produce harvested straight from local agricultural acreage
            </p>
          </div>
          <Link to="/products" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="card card-hover"
              style={{
                padding: '20px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>
                🌿
              </div>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>
                {cat.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {cat.description || 'Fresh harvest'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Fresh From Today's Harvest
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Organic fruits, farm vegetables, and cereals with guaranteed freshness
            </p>
          </div>
          <Link to="/products" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
            See All Products <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
            Loading freshly harvested products...
          </div>
        ) : (
          <div className="grid-cards">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works & Profit Calculation Highlight */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '40px',
        marginBottom: 32
      }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
            The Complete Agricultural Ecosystem
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Built for transparent farming economics with automated profit calculations from field to market.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24
        }}>
          <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#15803d', marginBottom: 12 }}>
              <Sprout size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
              1. 👨🌾 Farmer Empowerment
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              List produce with exact harvest dates, record operational costs (Seeds, Fertilizer, Labour, Irrigation), and monitor real-time net profits.
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#0369a1', marginBottom: 12 }}>
              <ShoppingBag size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
              2. 🛒 Buyer Direct Access
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              Browse freshly picked farm produce, filter by category &amp; price, checkout with live inventory deductions, and trace origins to the farmer.
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#b45309', marginBottom: 12 }}>
              <Coins size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
              3. 💰 Accurate Profit Engine
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              Automatically calculates <br />
              <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4, fontWeight: 700, color: '#92400e' }}>
                Profit = Revenue - Expenses
              </code>
              <br /> giving cultivators financial transparency and margin analytics per crop.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
