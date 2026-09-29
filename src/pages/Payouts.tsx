import { useState } from 'react';
import { Smartphone, History, TrendingUp } from 'lucide-react';

export default function Payouts() {
  const [tab, setTab] = useState('Pending');

  const pendingPayouts = [
    { id: 1, recipient: 'James Phiri', type: 'Courier', period: 'Weekly (May 3-10)', earnings: 'MWK 45,000', expected: 'MWK 45,000', method: 'Airtel Money', status: 'Due Today' },
    { id: 2, recipient: 'Casa Mia', type: 'Restaurant', period: 'Monthly (April)', earnings: 'MWK 850,000', expected: 'MWK 722,500', method: 'Bank Transfer', status: 'Processing', commission: '15%' },
    { id: 3, recipient: 'Chigumula Farms', type: 'Producer', period: 'Weekly (May 3-10)', earnings: 'MWK 120,000', expected: 'MWK 114,000', method: 'TNM Mpamba', status: 'Due Tomorrow', commission: '5%' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Financial Ledger & Payouts</h1>
        <p className="page-subtitle">Manage commissions, view expected earnings, and process Mobile Money payments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--primary)', color: 'white' }}>
          <h3 style={{ fontSize: 14, marginBottom: 8, opacity: 0.9 }}>Total Outstanding (Due)</h3>
          <p style={{ fontSize: 32, fontWeight: 700 }}>MWK 881,500</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>Projected Earnings (Next 7 Days)</h3>
          <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>MWK 3.1M <TrendingUp size={20} color="var(--success)" /></p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>Platform Commission Revenue (MTD)</h3>
          <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--success)' }}>MWK 415,000</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <button className={`btn ${tab === 'Pending' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('Pending')} style={{ borderRadius: '99px' }}>Pending Payouts</button>
        <button className={`btn ${tab === 'Projections' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('Projections')} style={{ borderRadius: '99px' }}>Earnings Projections</button>
        <button className={`btn ${tab === 'History' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('History')} style={{ borderRadius: '99px' }}>Payment History</button>
      </div>

      {tab === 'Pending' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Upcoming Payments</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Pay Period</th>
                  <th>Gross Earnings</th>
                  <th>Platform Comm.</th>
                  <th>Expected Payment</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayouts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.recipient}<br/><span style={{fontSize: 12, fontWeight: 'normal', color: 'var(--text-secondary)'}}>{p.type}</span></td>
                    <td>{p.period}</td>
                    <td>{p.earnings}</td>
                    <td>{p.commission || 'N/A'}</td>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{p.expected}</td>
                    <td>{p.method}</td>
                    <td>
                      <span className={`badge ${p.status === 'Due Today' ? 'badge-pending' : 'badge-success'}`} style={p.status === 'Processing' ? { background: 'var(--border-color)', color: 'var(--text-primary)' } : {}}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
                        <Smartphone size={14} /> Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Projections' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
           <TrendingUp size={48} style={{ margin: '0 auto 16px auto', color: 'var(--border-color)' }} />
           <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>Projections View Active</h3>
           <p>Based on current active orders, Courier earnings will increase by 14% this weekend.</p>
        </div>
      )}

      {tab === 'History' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
           <History size={48} style={{ margin: '0 auto 16px auto', color: 'var(--border-color)' }} />
           <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>No Recent History</h3>
           <p>Completed mobile money payouts will appear here.</p>
        </div>
      )}
    </div>
  );
}
