import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Sprout, 
  ShoppingCart, 
  User, 
  LogOut, 
  TrendingUp, 
  Package, 
  Receipt, 
  ShieldCheck, 
  ClipboardList 
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin, logout } = useAuth();
  const { totalItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 20px',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
            color: '#fff',
            width: 40,
            height: 40,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', letterSpacing: '-0.02em' }}>
              AgriReson
            </span>
            <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', fontWeight: 600, marginTop: -4 }}>
              Farm Marketplace &amp; Profit
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.95rem', color: '#334155' }}>
            Home
          </Link>
          <Link to="/products" style={{ fontWeight: 600, fontSize: '0.95rem', color: '#334155' }}>
            Marketplace
          </Link>

          {/* Farmer Specific Links */}
          {isFarmer && (
            <>
              <Link to="/farmer/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.925rem', color: '#15803d' }}>
                <Package size={17} /> Farmer Hub
              </Link>
              <Link to="/farmer/expenses" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.925rem', color: '#b45309' }}>
                <Receipt size={17} /> Expenses
              </Link>
              <Link to="/farmer/profit" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.925rem', color: '#15803d' }}>
                <TrendingUp size={17} /> Profit Tracker
              </Link>
            </>
          )}

          {/* Buyer Specific Links */}
          {isBuyer && (
            <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.925rem', color: '#0369a1' }}>
              <ClipboardList size={17} /> My Orders
            </Link>
          )}

          {/* Admin Specific Links */}
          {isAdmin && (
            <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.925rem', color: '#7e22ce' }}>
              <ShieldCheck size={17} /> Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Section: Cart & User Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Cart Icon (only if buyer or guest) */}
          {(!isAuthenticated || isBuyer) && (
            <Link to="/cart" style={{
              position: 'relative',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
              backgroundColor: '#f1f5f9'
            }}>
              <ShoppingCart size={22} />
              {totalItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totalItemCount}
                </span>
              )}
            </Link>
          )}

          {/* User Account Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>
                  {user?.name}
                </div>
                <span className={`badge ${isFarmer ? 'badge-farmer' : isAdmin ? 'badge-admin' : 'badge-buyer'}`} style={{ fontSize: '0.65rem' }}>
                  {isFarmer ? '👨🌾 Farmer' : isAdmin ? '👨💼 Admin' : '🛒 Buyer'}
                </span>
              </div>

              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '6px 10px', color: '#64748b' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
