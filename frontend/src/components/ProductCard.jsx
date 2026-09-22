import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Calendar, MapPin, Check, Plus, Minus } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isFarmer } = useAuth();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image */}
      <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
        <img
          src={product.imageUrl || fallbackImage}
          alt={product.name}
          onError={(e) => { e.target.src = fallbackImage; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Category Pill */}
        <span style={{
          position: 'absolute',
          top: 12,
          left: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#15803d',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {product.categoryName || 'Produce'}
        </span>

        {/* Harvest Date Badge */}
        {product.harvestDate && (
          <span style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <Calendar size={12} />
            Harvest: {product.harvestDate}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '0.825rem',
            color: '#64748b',
            marginTop: 4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description || 'Freshly harvested straight from the local fields.'}
          </p>
        </div>

        {/* Farmer Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.78rem',
          color: '#475569',
          backgroundColor: '#f8fafc',
          padding: '6px 10px',
          borderRadius: 6
        }}>
          <MapPin size={13} color="#15803d" />
          <span>Farmer: <strong>{product.farmerName || 'Local Farmer'}</strong></span>
        </div>

        {/* Price & Stock */}
        <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803d' }}>
                ₹{product.price}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                /{product.unit}
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isOutOfStock ? '#dc2626' : '#166534' }}>
              {isOutOfStock ? 'Out of Stock' : `${product.quantity} ${product.unit} left`}
            </div>
          </div>

          {/* Action Row */}
          {!isFarmer && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!isOutOfStock && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  backgroundColor: '#ffffff'
                }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    style={{ padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 8px', fontSize: '0.875rem', fontWeight: 700 }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                    style={{ padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
              >
                {added ? (
                  <>
                    <Check size={16} color="#15803d" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
