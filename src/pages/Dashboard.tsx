import React from 'react';
import { TrendingUp, Users, Store, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle">Welcome back, Admin. Here is what's happening today.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Sales Card -> Routes to Payouts */}
        <Link to="/payouts" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', transition: 'var(--transition)', cursor: 'pointer' }} 
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} 
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ position: 'absolute', top: 24, right: 24, background: 'var(--primary-light)', color: 'var(--primary)', padding: 8, borderRadius: 8 }}>
              <DollarSign size={20} />
            </div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>Total Sales Today</h3>
            <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>MWK 1.2M</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontSize: 12, fontWeight: 600 }}>
                 <TrendingUp size={14} /> +12.5% from yesterday
               </div>
               <ArrowRight size={16} color="var(--primary)" />
            </div>
          </div>
        </Link>

        {/* Drivers Card -> Routes to Approvals */}
        <Link to="/approvals" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', transition: 'var(--transition)', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} 
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
             <div style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: 8, borderRadius: 8 }}>
              <Users size={20} />
            </div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>Couriers (Active / Pending)</h3>
            <p style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>42 <span style={{fontSize: 18, color: '#f59e0b'}}>/ 12</span></p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Click to review applications</p>
               <ArrowRight size={16} color="var(--primary)" />
            </div>
          </div>
        </Link>

        {/* Vendors Card -> Routes to Vendors */}
        <Link to="/vendors" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', transition: 'var(--transition)', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} 
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
             <div style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: 8, borderRadius: 8 }}>
              <Store size={20} />
            </div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>Registered Partners</h3>
            <p style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>18</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Manage all vendors</p>
              <ArrowRight size={16} color="var(--primary)" />
            </div>
          </div>
        </Link>
      </div>
      
      {/* Mock Chart Area */}
      <div className="glass-panel" style={{ padding: '24px', minHeight: '300px' }}>
         <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Weekly Revenue (Mock)</h3>
         <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1, background: 'var(--primary-light)', height: '40%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'var(--primary)', height: '60%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'var(--primary-light)', height: '35%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'var(--primary)', height: '80%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'var(--primary-light)', height: '50%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'var(--primary)', height: '90%', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: 'var(--bg-color)', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 'bold' }}>Today</div>
            </div>
            <div style={{ flex: 1, background: 'var(--border-color)', height: '20%', borderRadius: '4px 4px 0 0' }}></div>
         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-secondary)', fontSize: 12 }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
         </div>
      </div>
    </div>
  );
}
