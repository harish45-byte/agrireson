import React, { useState, useEffect } from 'react';
import { expenseApi, cropApi } from '../services/api';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Calendar, 
  Coins, 
  AlertCircle, 
  Check, 
  Filter, 
  X 
} from 'lucide-react';

const EXPENSE_TYPES = [
  { value: 'SEEDS', label: '🌱 Seeds' },
  { value: 'FERTILIZER', label: '🧪 Fertilizer' },
  { value: 'PESTICIDES', label: '🛡️ Pesticides' },
  { value: 'LABOUR', label: '👥 Labour' },
  { value: 'IRRIGATION', label: '💧 Irrigation' },
  { value: 'EQUIPMENT', label: '🚜 Equipment' },
  { value: 'TRANSPORT', label: '🚚 Transport' },
  { value: 'OTHER', label: '📦 Other Operational' },
];

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cropId: '',
    expenseType: 'SEEDS',
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const [expRes, cropRes] = await Promise.all([
        expenseApi.getAll(),
        cropApi.getAll(),
      ]);
      setExpenses(expRes.data);
      setCrops(cropRes.data);
    } catch (err) {
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        cropId: formData.cropId ? Number(formData.cropId) : null,
        expenseType: formData.expenseType,
        amount: Number(formData.amount),
        description: formData.description.trim(),
        expenseDate: formData.expenseDate,
      };

      await expenseApi.create(payload);
      setSuccess('Expense successfully recorded!');
      setIsModalOpen(false);
      setFormData({
        cropId: '',
        expenseType: 'SEEDS',
        amount: '',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
      });
      loadExpenses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense record?')) return;
    try {
      await expenseApi.delete(id);
      loadExpenses();
    } catch (err) {
      alert('Failed to delete expense record');
    }
  };

  const totalExpenseSum = expenses.reduce((sum, item) => sum + item.amount, 0);

  const filteredExpenses = selectedTypeFilter
    ? expenses.filter((e) => e.expenseType === selectedTypeFilter)
    : expenses;

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
            Agricultural Expense Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Record seeds, fertilizer, labour, and irrigation costs to calculate accurate net profit.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Record New Expense
        </button>
      </div>

      {success && (
        <div className="alert alert-success">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Total Expenses Banner */}
      <div className="card" style={{
        padding: '24px 32px',
        marginBottom: 28,
        background: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Cultivation Outlay
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: 4 }}>
              ₹{totalExpenseSum.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: 2 }}>
              Across {expenses.length} itemized inputs recorded on farm.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setIsModalOpen(true)} className="btn" style={{ backgroundColor: '#ffffff', color: '#78350f', fontWeight: 700 }}>
              <Plus size={16} /> Add Input Cost
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setSelectedTypeFilter('')}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: selectedTypeFilter === '' ? '#b45309' : '#f1f5f9',
            color: selectedTypeFilter === '' ? '#ffffff' : '#475569'
          }}
        >
          All Types ({expenses.length})
        </button>

        {EXPENSE_TYPES.map((t) => {
          const count = expenses.filter((e) => e.expenseType === t.value).length;
          return (
            <button
              key={t.value}
              onClick={() => setSelectedTypeFilter(t.value)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedTypeFilter === t.value ? '#b45309' : '#f1f5f9',
                color: selectedTypeFilter === t.value ? '#ffffff' : '#475569'
              }}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Expenses Table */}
      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
          Loading expense records...
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🧾</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No expenses recorded</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4, marginBottom: 20 }}>
            Start logging your seeds, fertilizers, and labour costs to enable automated profit calculation.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Record First Expense
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>Expense Type</th>
                <th>Description</th>
                <th>Crop Allocation</th>
                <th>Expense Date</th>
                <th>Amount (₹)</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: '0.8rem'
                    }}>
                      {exp.expenseType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>
                      {exp.description || 'Input cost'}
                    </div>
                  </td>
                  <td>{exp.cropName || 'Farm Overhead'}</td>
                  <td>
                    <span style={{ fontSize: '0.825rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} /> {exp.expenseDate}
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, color: '#b45309', fontSize: '1.05rem' }}>
                    ₹{exp.amount.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '6px 8px' }}
                      title="Delete Expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Record Farm Expense</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Expense Category *</label>
                  <select
                    required
                    className="form-control"
                    value={formData.expenseType}
                    onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
                  >
                    {EXPENSE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-control"
                    placeholder="e.g. 3000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Allocate To Crop (Optional)</label>
                  <select
                    className="form-control"
                    value={formData.cropId}
                    onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                  >
                    <option value="">General Farm Expense</option>
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>{c.cropName} ({c.area} acres)</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Expense Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Vendor</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Hybrid tomato seeds purchased from agro center"
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
