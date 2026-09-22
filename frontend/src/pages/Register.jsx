import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_BUYER');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const userData = await register({
        name,
        email,
        password,
        role,
        phone,
        address,
      });

      if (userData.role === 'ROLE_FARMER') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
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
            Create an Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>
            Join the agricultural marketplace ecosystem
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">I am joining as a:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div
                onClick={() => setRole('ROLE_FARMER')}
                style={{
                  border: `2px solid ${role === 'ROLE_FARMER' ? '#15803d' : 'var(--border)'}`,
                  borderRadius: 10,
                  padding: 12,
                  cursor: 'pointer',
                  backgroundColor: role === 'ROLE_FARMER' ? '#f0fdf4' : '#ffffff',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '1.4rem' }}>👨🌾</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#15803d' }}>Farmer</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Sell &amp; Track Profit</div>
              </div>

              <div
                onClick={() => setRole('ROLE_BUYER')}
                style={{
                  border: `2px solid ${role === 'ROLE_BUYER' ? '#0284c7' : 'var(--border)'}`,
                  borderRadius: 10,
                  padding: 12,
                  cursor: 'pointer',
                  backgroundColor: role === 'ROLE_BUYER' ? '#f0f9ff' : '#ffffff',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '1.4rem' }}>🛒</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0284c7' }}>Buyer</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Fresh Farm Produce</div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 characters)</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="+91-9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address / Farm Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Village, District, State / Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            <UserPlus size={18} /> {submitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#15803d', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
