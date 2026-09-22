import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  TrendingUp, 
  Coins, 
  Receipt, 
  Package, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sprout, 
  Printer 
} from 'lucide-react';

const ProfitDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getFarmerProfit()
      .then((res) => setSummary(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        Calculating profit and loss statements...
      </div>
    );
  }

  const isProfitable = (summary?.profit || 0) >= 0;

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
            💰 Farm Profit &amp; Loss Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Audited financial breakdown of sales revenue versus cultivation operational costs.
          </p>
        </div>

        <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
          <Printer size={16} /> Print Statement
        </button>
      </div>

      {/* Main KPI Stats */}
      <div className="grid-stats">
        <StatCard
          title="Total Sales Revenue"
          value={`₹${summary?.revenue?.toLocaleString() || 0}`}
          subtitle={`${summary?.productsSold || 0} kg/units delivered`}
          icon={Coins}
          color="#15803d"
          bg="#dcfce7"
        />

        <StatCard
          title="Total Cultivation Expenses"
          value={`₹${summary?.expenses?.toLocaleString() || 0}`}
          subtitle="Seeds, fertilizer, labour, etc."
          icon={Receipt}
          color="#b45309"
          bg="#fef3c7"
        />

        <StatCard
          title="Realized Net Profit"
          value={`₹${summary?.profit?.toLocaleString() || 0}`}
          subtitle={`${summary?.profitMargin || 0}% Profit Margin`}
          icon={TrendingUp}
          color={isProfitable ? '#15803d' : '#dc2626'}
          bg={isProfitable ? '#dcfce7' : '#fee2e2'}
        />

        <StatCard
          title="Marketplace Activity"
          value={`${summary?.activeProducts || 0} Active`}
          subtitle={`${summary?.pendingOrders || 0} Pending orders`}
          icon={Package}
          color="#0284c7"
          bg="#e0f2fe"
        />
      </div>

      {/* Prominent Architectural Diagram Box Matching Section 4 Prompt */}
      <div className="card" style={{
        padding: '32px',
        marginBottom: 32,
        backgroundColor: '#ffffff',
        border: '2px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span className="badge badge-farmer" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            🌾 Cultivator Statement of Profitability
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: 8 }}>
            Net Profit Equation
          </h2>
        </div>

        {/* Calculation Visualizer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          backgroundColor: '#f8fafc',
          padding: 24,
          borderRadius: 12,
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Gross Sales Revenue
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#15803d', marginTop: 4 }}>
              + ₹{summary?.revenue?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d' }}>
              Tomato &amp; produce orders
            </div>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 300, color: '#94a3b8' }}>
            —
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Cultivation Inputs
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309', marginTop: 4 }}>
              ₹{summary?.expenses?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#b45309' }}>
              Seeds, fertilizer, labour, etc.
            </div>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 300, color: '#94a3b8' }}>
            =
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Realized Net Profit
            </div>
            <div style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: isProfitable ? '#15803d' : '#dc2626',
              marginTop: 4
            }}>
              ₹{summary?.profit?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isProfitable ? '#15803d' : '#dc2626' }}>
              {isProfitable ? 'Profitable Yield' : 'Operating at Loss'} ({summary?.profitMargin || 0}% margin)
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Expense Distribution & Crop Margins */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 32 }}>
        {/* Left: Expense Breakdown */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Expense Breakdown by Category
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Total: ₹{summary?.expenses?.toLocaleString()}
            </span>
          </div>

          {summary?.expenseBreakdown?.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              No itemized expenses recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {summary?.expenseBreakdown?.map((item) => (
                <div key={item.expenseType}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>
                      {item.expenseType}
                    </span>
                    <span style={{ fontWeight: 700, color: '#b45309' }}>
                      ₹{item.amount.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ width: '100%', height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor: '#b45309',
                      borderRadius: 4
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Crop-Wise Margins */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Crop-Wise Profitability
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {summary?.cropProfits?.length || 0} Crops
            </span>
          </div>

          {summary?.cropProfits?.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              No crops with linked revenue or expenses yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {summary?.cropProfits?.map((c) => {
                const cProfitable = c.profit >= 0;
                return (
                  <div key={c.cropId} style={{
                    padding: 14,
                    borderRadius: 8,
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                        {c.cropName} ({c.area} Acres)
                      </div>
                      <div style={{ fontWeight: 800, color: cProfitable ? '#15803d' : '#dc2626' }}>
                        ₹{c.profit.toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                      <span>Revenue: <strong>₹{c.revenue.toLocaleString()}</strong></span>
                      <span>Expense: <strong>₹{c.expenses.toLocaleString()}</strong></span>
                      <span>Margin: <strong>{c.profitMargin}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitDashboard;
