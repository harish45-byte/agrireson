import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { Package, Clock, MapPin, Phone, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-pending">Pending Dispatch</span>;
      case 'CONFIRMED':
        return <span className="badge badge-confirmed">Confirmed</span>;
      case 'SHIPPED':
        return <span className="badge badge-shipped">In Transit</span>;
      case 'DELIVERED':
        return <span className="badge badge-delivered">Delivered</span>;
      case 'CANCELLED':
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
          My Farm Orders
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Track delivery progress and historical purchases directly from farm producers.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 480, margin: '40px auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📦</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No orders placed yet</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4, marginBottom: 20 }}>
            Start purchasing fresh, sustainably grown farm produce directly from cultivators.
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: 24 }}>
              {/* Top Meta Bar */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                paddingBottom: 16,
                borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Package size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                      Order #{order.id}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Recent'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {getStatusBadge(order.status)}
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803d' }}>
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '16px 0' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 12 }}>
                  Purchased Items ({order.items?.length || 0})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {order.items?.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc',
                      padding: '10px 14px',
                      borderRadius: 8
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 6, backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            🌱
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#1e293b' }}>
                            {item.productName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            Farmer: {item.farmerName} • {item.quantity} {item.productUnit} @ ₹{item.price}/{item.productUnit}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        ₹{item.subtotal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details Footer */}
              <div style={{
                paddingTop: 12,
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                fontSize: '0.825rem',
                color: '#64748b',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color="#15803d" />
                  <span>Ship To: <strong>{order.shippingAddress}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={14} />
                  <span>Contact: {order.contactPhone}</span>
                </div>
                <div>
                  Payment: <strong>{order.paymentMethod}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
