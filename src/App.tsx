import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileSpreadsheet, Map, Wallet, Store, ExternalLink, Settings as SettingsIcon, PackageSearch } from 'lucide-react'

import Dashboard from './pages/Dashboard'
import Approvals from './pages/Approvals'
import Vendors from './pages/Vendors'
import Products from './pages/Products'
import Logistics from './pages/Logistics'
import Inventory from './pages/Inventory'
import Payouts from './pages/Payouts'
import Settings from './pages/Settings'
import { SITE } from './config/site'
import { supabase, isSupabaseConfigured } from './lib/supabase'

function Sidebar() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/approvals', icon: Users, label: 'Driver Approvals' },
    { path: '/vendors', icon: Store, label: 'Vendor Directory' },
    { path: '/products', icon: PackageSearch, label: 'Product CMS' },
    { path: '/inventory', icon: FileSpreadsheet, label: 'Bulk Inventory' },
    { path: '/logistics', icon: Map, label: 'Live Map' },
    { path: '/payouts', icon: Wallet, label: 'Payouts Ledger' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="ChanguEats Logo" style={{ width: 64, height: 64, borderRadius: 12 }} />
        <span style={{ fontSize: '18px' }}>ChanguEats</span>
      </div>
      
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer" style={{ padding: '24px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a 
          href={SITE.marketing} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}
        >
          <ExternalLink size={18} />
          <span>Kainoter.com (marketing)</span>
        </a>
        <a 
          href={SITE.admin} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}
        >
          <ExternalLink size={18} />
          <span>Admin portal bookmark</span>
        </a>
      </div>
    </div>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState(() => (import.meta.env.DEV ? 'admin@changueats.com' : ''))
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const applyTheme = useCallback(() => {
    const theme = localStorage.getItem('adminTheme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false
    void (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled || !session?.user) return
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
      if (prof?.role === 'admin') setIsAuthenticated(true)
      else await supabase.auth.signOut()
    })()
    return () => { cancelled = true }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isSupabaseConfigured) return
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (!session) {
        setIsAuthenticated(false)
        return
      }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
      if (prof?.role !== 'admin') {
        await supabase.auth.signOut()
        setIsAuthenticated(false)
      }
    })
    return () => { sub.subscription.unsubscribe() }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    
    const timeoutMinutes = Number(localStorage.getItem('adminTimeoutMinutes')) || 15;
    const timeoutMs = timeoutMinutes * 60 * 1000;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        void supabase.auth.signOut()
        setIsAuthenticated(false);
        window.location.reload(); 
      }, timeoutMs);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer, true));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer, true));
    };
  }, [isAuthenticated]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    if (isSupabaseConfigured) {
      setLoginLoading(true)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) {
          setLoginError(error.message)
          return
        }
        if (!data.user) {
          setLoginError('No user returned.')
          return
        }
        const { data: prof, error: pErr } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle()
        if (pErr) {
          setLoginError(pErr.message)
          await supabase.auth.signOut()
          return
        }
        if (prof?.role !== 'admin') {
          setLoginError('This account is not an admin. Ask the project owner to set profiles.role = admin for your user in Supabase.')
          await supabase.auth.signOut()
          return
        }
        setIsAuthenticated(true)
      } finally {
        setLoginLoading(false)
      }
      return
    }
    setIsAuthenticated(true)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <img src="/logo.png" alt="ChanguEats Logo" style={{ width: 80, height: 80, borderRadius: 16, marginBottom: '24px', alignSelf: 'center' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>Admin Portal</h1>
          <p style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>Sign in to manage the platform</p>
          <p style={{ marginBottom: 20, fontSize: '13px', color: 'var(--text-secondary)' }}>
            <a href={SITE.marketing} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Kainoter.com</a>
            {' · '}
            <span style={{ opacity: 0.85 }}>{SITE.admin.replace('https://', '')}</span>
          </p>

          {!isSupabaseConfigured && (
            <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: 'rgba(245, 158, 11, 0.12)', color: '#b45309', fontSize: 13, textAlign: 'left' }}>
              <strong>Demo mode:</strong> Supabase env vars are not set on this deploy. The button below opens the UI without checking a password. For production, set <code style={{ fontSize: 11 }}>VITE_SUPABASE_URL</code> and <code style={{ fontSize: 11 }}>VITE_SUPABASE_ANON_KEY</code> (same as the mobile app) and use an account with <code style={{ fontSize: 11 }}>profiles.role = 'admin'</code>.
            </div>
          )}

          {isSupabaseConfigured && (
            <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left' }}>
              Supabase is configured. Sign in with an <strong>admin</strong> account (email + password enabled in Supabase Auth).
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <input type="email" placeholder="Email" className="input" style={{ marginBottom: 16, width: '100%' }} value={email} onChange={(ev) => setEmail(ev.target.value)} autoComplete="username" />
            <input type="password" placeholder="Password" className="input" style={{ marginBottom: 16, width: '100%' }} value={password} onChange={(ev) => setPassword(ev.target.value)} autoComplete="current-password" />
            {loginError && (
              <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, textAlign: 'left' }}>{loginError}</p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loginLoading}>
              {loginLoading ? 'Signing in…' : isSupabaseConfigured ? 'Sign In' : 'Open dashboard (demo)'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Layout>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => void handleSignOut()}>
            Sign out
          </button>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
