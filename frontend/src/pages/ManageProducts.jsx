import React, { useState, useEffect } from 'react';
import { productApi, categoryApi, cropApi } from '../services/api';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    cropId: '',
    price: '',
    quantity: '',
    unit: 'kg',
    harvestDate: '',
    imageUrl: '',
    description: '',
    active: true,
  });

  // Stock update modal state
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [stockInput, setStockInput] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, cropRes] = await Promise.all([
        productApi.getFarmerProducts(),
        categoryApi.getAll(),
        cropApi.getAll(),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setCrops(cropRes.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      cropId: '',
      price: '',
      quantity: '',
      unit: 'kg',
      harvestDate: new Date().toISOString().split('T')[0],
      imageUrl: '',
      description: '',
      active: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      categoryId: p.categoryId,
      cropId: p.cropId || '',
      price: p.price,
      quantity: p.quantity,
      unit: p.unit,
      harvestDate: p.harvestDate || '',
      imageUrl: p.imageUrl || '',
      description: p.description || '',
      active: p.active,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        name: formData.name.trim(),
        categoryId: Number(formData.categoryId),
        cropId: formData.cropId ? Number(formData.cropId) : null,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        unit: formData.unit,
        harvestDate: formData.harvestDate || null,
        imageUrl: formData.imageUrl.trim() || null,
        description: formData.description.trim(),
        active: formData.active,
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, payload);
        setSuccess('Product successfully updated!');
      } else {
        await productApi.create(payload);
        setSuccess('New produce successfully added to marketplace!');
      }

      setIsModalOpen(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product listing?')) return;
    try {
      await productApi.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleQuickStockUpdate = async (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    try {
      await productApi.updateStock(stockModalProduct.id, Number(stockInput));
      setStockModalProduct(null);
      loadData();
    } catch (err) {
      alert('Failed to update stock quantity');
    }
  };

  return (
    <div>
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
            Produce Inventory &amp; Listings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Add freshly harvested crops, edit prices, and manage stock quantities.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add Harvest Listing
        </button>
      </div>

      {success && (
        <div className="alert alert-success">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
          Loading your produce listings...
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🧺</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No listings found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4, marginBottom: 20 }}>
            List your harvested tomatoes, grains, fruits, and dairy to begin selling.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} /> Add First Product
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>Produce Name</th>
                <th>Category</th>
                <th>Linked Crop</th>
                <th>Price</th>
                <th>Stock In Hand</th>
                <th>Harvest Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&fit=crop'}
                        alt={p.name}
                        style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{p.categoryName || 'General'}</td>
                  <td>{p.cropName || '—'}</td>
                  <td style={{ fontWeight: 700, color: '#15803d' }}>
                    ₹{p.price} / {p.unit}
                  </td>
                  <td>
                    <button
                      onClick={() => { setStockModalProduct(p); setStockInput(p.quantity); }}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid var(--border)',
                        padding: '4px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                      title="Click to quickly update stock"
                    >
                      {p.quantity} {p.unit} ✏️
                    </button>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.825rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} /> {p.harvestDate || 'Fresh'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.active ? 'badge-farmer' : 'badge-cancelled'}`}>
                      {p.active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => openEditModal(p)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 8px' }}
                        title="Edit Produce"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 8px' }}
                        title="Delete Produce"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingProduct ? 'Edit Produce Listing' : 'Add New Harvest Produce'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Produce Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Organic Farm Tomatoes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      required
                      className="form-control"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Linked Crop</label>
                    <select
                      className="form-control"
                      value={formData.cropId}
                      onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                    >
                      <option value="">None / General</option>
                      {crops.map((cr) => (
                        <option key={cr.id} value={cr.id}>{cr.cropName} ({cr.area} ac)</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-control"
                      placeholder="40"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="form-control"
                      placeholder="200"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit *</label>
                    <select
                      className="form-control"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="liter">liter</option>
                      <option value="box">box</option>
                      <option value="dozen">dozen</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Harvest Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="Describe how it was grown, variety, freshness..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Update Modal */}
      {stockModalProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Update Stock Quantity</h3>
              <button onClick={() => setStockModalProduct(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleQuickStockUpdate}>
              <div className="modal-body">
                <div style={{ marginBottom: 12, fontSize: '0.9rem', color: '#475569' }}>
                  Product: <strong>{stockModalProduct.name}</strong>
                </div>
                <div className="form-group">
                  <label className="form-label">New Available Quantity ({stockModalProduct.unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    className="form-control"
                    value={stockInput}
                    onChange={(e) => setStockInput(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setStockModalProduct(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
