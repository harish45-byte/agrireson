import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, orderApi, productApi, cropApi } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  TrendingUp, 
  Coins, 
  Receipt, 
  Package, 
  Clock, 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Truck 
} from 'lucide-react';

const FarmerDashboard = () => {
  const [profitData, setProfitData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profitRes, ordersRes, cropsRes] = await Promise.all([
        dashboardApi.getFarmerProfit(),
        orderApi.getFarmerOrders(),
        cropApi.getAll()
      ]);
      setProfitData(profitRes.data);
      setRecentOrders(ordersRes.data.slice(0, 8));
      setCrops(cropsRes.data);
    } catch (err) {
      console.error('Error fetching farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        Loading farmer metrics &amp; calculations...
      </div>
    );
  }

  const isProfitable = (profitData?.profit || 0) >= 0;

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
            👨🌾 Farmer Control Center
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Monitor your harvests, input costs, and net realized earnings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/farmer/products" className="btn btn-secondary btn-sm">
            <Package size={16} /> Manage Products
          </Link>
          <Link to="/farmer/expenses" className="btn btn-secondary btn-sm">
            <Receipt size={16} /> Log Expense
          </Link>
          <Link to="/farmer/profit" className="btn btn-primary btn-sm">
            <TrendingUp size={16} /> Full Profit Analysis
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-stats">
        <StatCard
          title="Total Sales Revenue"
          value={`₹${profitData?.revenue || 0}`}
          subtitle={`${profitData?.productsSold || 0} units sold`}
          icon={Coins}
          color="#15803d"
          bg="#dcfce7"
        />

        <StatCard
          title="Total Farm Expenses"
          value={`₹${profitData?.expenses || 0}`}
          subtitle="Seeds, fertilizer, labour, etc."
          icon={Receipt}
          color="#b45309"
          bg="#fef3c7"
        />

        <StatCard
          title="Net Farm Profit"
          value={`₹${profitData?.profit || 0}`}
          subtitle={profitData?.revenue > 0 ? `${profitData?.profitMargin}% Margin` : 'Awaiting sales'}
          icon={TrendingUp}
          color={isProfitable ? '#15803d' : '#dc2626'}
          bg={isProfitable ? '#dcfce7' : '#fee2e2'}
        />

        <StatCard
          title="Active Listings"
          value={profitData?.activeProducts || 0}
          subtitle={`${profitData?.pendingOrders || 0} orders pending`}
          icon={Package}
          color="#0284c7"
          bg="#e0f2fe"
        />
      </div>

      {/* Quick Summary Banner Matching Section 4 */}
      <div className="card" style={{
        padding: '24px 28px',
        marginBottom: 32,
        backgroundColor: '#f8fafc',
        borderLeft: `6px solid ${isProfitable ? '#15803d' : '#dc2626'}`
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Financial Formula Realization
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              Profit = Total Revenue (₹{profitData?.revenue || 0}) - Total Expenses (₹{profitData?.expenses || 0}) = <span style={{ color: isProfitable ? '#15803d' : '#dc2626' }}>₹{profitData?.profit || 0}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
              Current Farm Margin: <strong>{profitData?.profitMargin || 0}%</strong> across all crop lifecycles.
            </div>
          </div>

          <Link to="/farmer/profit" className="btn btn-primary btn-sm">
            View Graphical Breakdown <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Crop Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Left: Orders placed for farmer's items */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Orders for Your Produce
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {recentOrders.length} order items
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              No buyer orders yet. Produce listed in the marketplace will appear here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentOrders.map((item) => (
                <div key={item.id} style={{
                  padding: 14,
                  borderRadius: 8,
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                      {item.productName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Quantity: <strong>{item.quantity} {item.productUnit}</strong> • Subtotal: <strong>₹{item.subtotal}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#15803d' }}>
                      ₹{item.subtotal}
                    </div>
                    <span className="badge badge-delivered" style={{ fontSize: '0.68rem', marginTop: 4 }}>
                      Verified Sale
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Crops & Acres */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Crop Plantings ({crops.length})
            </h3>
            <Link to="/farmer/profit" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d' }}>
              Crop Profits →
            </Link>
          </div>

          {crops.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              No crops tracked yet. Add crops to assign expenses and calculate crop-level margins.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {crops.map((crop) => (
                <div key={crop.id} style={{
                  padding: 14,
                  borderRadius: 8,
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                      {crop.cropName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Cultivated Area: <strong>{crop.area} Acres</strong> • Status: {crop.status}
                    </div>
                  </div>

                  <span className="badge badge-farmer">
                    {crop.status || 'ACTIVE'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
