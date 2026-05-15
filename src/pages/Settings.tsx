import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Clock, ShieldAlert, Database } from 'lucide-react';
import { SITE } from '../config/site';
import { isSupabaseConfigured, testSupabaseRead } from '../lib/supabase';

export default function Settings() {
  const [timeoutMinutes, setTimeoutMinutes] = useState(
    Number(localStorage.getItem('adminTimeoutMinutes')) || 15
  );
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'light');
  
  const [isSaved, setIsSaved] = useState(false);
  const [backendCheck, setBackendCheck] = useState<{ loading: boolean; ok?: boolean; detail?: string }>({ loading: true });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const r = await testSupabaseRead();
      if (!cancelled) setBackendCheck({ loading: false, ok: r.ok, detail: r.detail });
    })();
    return () => { cancelled = true };
  }, []);

  const handleSave = () => {
    localStorage.setItem('adminTimeoutMinutes', timeoutMinutes.toString());
    localStorage.setItem('adminTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    // Reload the page to immediately apply the new timeout to the App.tsx listener
    window.location.reload();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Security Settings</h1>
        <p className="page-subtitle">Configure dashboard protection and access timeouts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Clock size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Auto-Logout Timeout</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Protect sensitive financial data when idle.</p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Minutes of Inactivity before Logout
            </label>
            <select 
              className="input" 
              value={timeoutMinutes} 
              onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
            >
              <option value={1}>1 Minute (Testing)</option>
              <option value={5}>5 Minutes</option>
              <option value={15}>15 Minutes (Default)</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
              <option value={999999}>Never Timeout (Not Recommended)</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave}>
            {isSaved ? 'Settings Applied!' : 'Save Settings'}
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
              <SettingsIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Appearance</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Customize your dashboard view.</p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Theme Mode
            </label>
            <select 
              className="input" 
              value={theme} 
              onChange={(e) => {
                setTheme(e.target.value);
                document.documentElement.setAttribute('data-theme', e.target.value);
                localStorage.setItem('adminTheme', e.target.value);
              }}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', backgroundColor: backendCheck.ok ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', backgroundColor: backendCheck.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: backendCheck.ok ? '#059669' : '#ef4444' }}>
              <Database size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Backend & Supabase</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Same database as the ChanguEats mobile app</p>
            </div>
          </div>
          {backendCheck.loading ? (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Checking connection…</p>
          ) : (
            <>
              <p style={{ fontSize: '14px', marginBottom: 8, fontWeight: 600, color: backendCheck.ok ? '#059669' : '#dc2626' }}>
                {backendCheck.ok ? 'Read test passed' : 'Read test failed or not configured'}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                {backendCheck.detail}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Admin URL: <strong>{SITE.admin}</strong>
                {!isSupabaseConfigured && (
                  <> · Set <code>VITE_SUPABASE_*</code> on your host to match <code>EXPO_PUBLIC_SUPABASE_*</code> in the app.</>
                )}
              </p>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>Sign-in mode</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {isSupabaseConfigured ? 'Supabase email/password + profiles.role = admin' : 'Demo unlock — configure env for production'}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            With Supabase configured, only users whose <code>profiles</code> row has <code>role = 'admin'</code> can stay signed in.
            Create the user in Supabase Auth, then set role in the <code>profiles</code> table (or SQL).
          </p>
        </div>
      </div>
    </div>
  );
}
