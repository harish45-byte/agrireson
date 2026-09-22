import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (!shippingAddress.trim() || !contactPhone.trim()) {
      setError('Please provide delivery address and contact phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        contactPhone,
        paymentMethod,
      };

      const res = await orderApi.create(payload);
      setSuccessOrder(res.data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to place order. Check stock availability.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div style={{ maxWidth: 560, margin: '40px auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            Order Placed Successfully!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 20 }}>
            Order #{successOrder.id} has been registered and routed to the cultivators.
          </p>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
            marginBottom: 24,
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Total Paid / Due:</span>
              <strong style={{ color: '#15803d' }}>₹{successOrder.totalAmount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Payment Mode:</span>
              <strong>{successOrder.paymentMethod}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Delivery To:</span>
              <span style={{ maxWidth: 260, textAlign: 'right' }}>{successOrder.shippingAddress}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary">
              View Order History
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: 48 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <ShoppingBag size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 6, marginBottom: 24 }}>
            Explore fresh farm harvests and support your local cultivators.
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Produce Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
          Shopping Cart ({cartItems.length} items)
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Review your items and enter delivery details to place your direct farm order.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>
        {/* Left Column: Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&fit=crop'}
                alt={product.name}
                style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                  {product.name}
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Farmer: {product.farmerName} • ₹{product.price} / {product.unit}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    backgroundColor: '#ffffff'
                  }}>
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 700 }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.8rem'
                    }}
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.15rem', color: '#15803d' }}>
                ₹{product.price * quantity}
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Right Column: Order Summary & Checkout Form */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
            Delivery &amp; Checkout
          </h3>

          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label className="form-label">Shipping / Delivery Address</label>
              <textarea
                required
                rows={2}
                className="form-control"
                placeholder="Door/Flat No, Street, Landmark, City, Pincode"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Contact Phone</label>
              <input
                type="tel"
                required
                className="form-control"
                placeholder="+91-9876543210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                <option value="UPI / QR Code">UPI (GPay / PhonePe / Paytm)</option>
                <option value="NetBanking">Net Banking</option>
              </select>
            </div>

            {/* Price Calculations */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: '#475569' }}>
                <span>Subtotal:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: '#475569' }}>
                <span>Delivery:</span>
                <span style={{ color: '#15803d', fontWeight: 600 }}>FREE (Direct Farm)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#15803d' }}>₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px 20px', fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? 'Processing Order...' : `Place Order (₹${totalAmount})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
