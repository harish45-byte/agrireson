import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const userData = await login(email, password);
      // Route based on role
      if (userData.role === 'ROLE_FARMER') {
        navigate('/farmer/dashboard');
      } else if (userData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        const dest = location.state?.from?.pathname || '/products';
        navigate(dest);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div style={{ maxWidth: 440, margin: '40px auto' }}>
      <div className="card" style={{ padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#dcfce7',
            color: '#15803d',
            marginBottom: 12
          }}>
            <Sprout size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>
            Sign in to access your farm marketplace account
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="you@farmmarket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            <LogIn size={18} /> {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase' }}>
            One-Click Demo Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('farmer@farmmarket.com', 'farmer123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '8px 4px', flexDirection: 'column', gap: 2 }}
            >
              <span>👨🌾 Farmer</span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Ramesh</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('buyer@farmmarket.com', 'buyer123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '8px 4px', flexDirection: 'column', gap: 2 }}
            >
              <span>🛒 Buyer</span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Priya</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@farmmarket.com', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '8px 4px', flexDirection: 'column', gap: 2 }}
            >
              <span>👨💼 Admin</span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>HQ Staff</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#15803d', fontWeight: 700 }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
