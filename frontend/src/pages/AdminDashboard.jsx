import React, { useState, useEffect } from 'react';
import { dashboardApi, adminApi, categoryApi } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingBag, 
  Coins, 
  Plus, 
  Trash2, 
  Clock, 
  Check, 
  X, 
  FolderTree 
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('users');

  // Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Sprout');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, catRes, ordersRes] = await Promise.all([
        dashboardApi.getAdminStats(),
        adminApi.getUsers(),
        categoryApi.getAll(),
        adminApi.getOrders(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setCategories(catRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryApi.create({
        name: catName.trim(),
        description: catDesc.trim(),
        icon: catIcon,
      });
      setIsCatModalOpen(false);
      setCatName('');
      setCatDesc('');
      loadAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryApi.delete(id);
      loadAdminData();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user from the platform?')) return;
    try {
      await adminApi.deleteUser(id);
      loadAdminData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        Loading marketplace administration oversight...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        marginBottom: 28
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            👨💼 Admin Marketplace Oversight
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Full system control, vendor management, categories, and marketplace volume.
          </p>
        </div>

        <button onClick={() => setIsCatModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid-stats">
        <StatCard
          title="Total Marketplace GMV"
          value={`₹${stats?.totalMarketplaceRevenue?.toLocaleString() || 0}`}
          subtitle="Delivered customer sales"
          icon={Coins}
          color="#15803d"
          bg="#dcfce7"
        />

        <StatCard
          title="Registered Cultivators"
          value={stats?.totalFarmers || 0}
          subtitle="Active farmers selling"
          icon={Users}
          color="#b45309"
          bg="#fef3c7"
        />

        <StatCard
          title="Registered Buyers"
          value={stats?.totalBuyers || 0}
          subtitle="Active retail shoppers"
          icon={ShoppingBag}
          color="#0284c7"
          bg="#e0f2fe"
        />

        <StatCard
          title="Total Orders Placed"
          value={stats?.totalOrders || 0}
          subtitle={`${stats?.pendingOrders || 0} Pending`}
          icon={Package}
          color="#7e22ce"
          bg="#f3e8ff"
        />
      </div>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'users' ? '#15803d' : '#64748b',
            borderBottom: activeTab === 'users' ? '3px solid #15803d' : '3px solid transparent'
          }}
        >
          Users Directory ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'categories' ? '#15803d' : '#64748b',
            borderBottom: activeTab === 'categories' ? '3px solid #15803d' : '3px solid transparent'
          }}
        >
          Produce Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'orders' ? '#15803d' : '#64748b',
            borderBottom: activeTab === 'orders' ? '3px solid #15803d' : '3px solid transparent'
          }}
        >
          Platform Orders ({orders.length})
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'ROLE_FARMER' ? 'badge-farmer' : u.role === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-buyer'}`}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td>{u.address || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    {u.role !== 'ROLE_ADMIN' && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 8px' }}
                        title="Remove user"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {categories.map((c) => (
              <div key={c.id} className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                    {c.description || 'Agricultural Category'}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '6px 8px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Order Date</th>
                <th>Total (₹)</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>#{o.id}</td>
                  <td>{o.buyerName}</td>
                  <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : 'Recent'}</td>
                  <td style={{ fontWeight: 700, color: '#15803d' }}>₹{o.totalAmount}</td>
                  <td>{o.paymentMethod}</td>
                  <td>
                    <span className="badge badge-delivered">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      {isCatModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add Produce Category</h3>
              <button onClick={() => setIsCatModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Organic Honey &amp; Spices"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="Brief description of the category..."
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
