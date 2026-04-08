import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, BarChart2, MessageSquare, Bell, Settings, TrendingUp } from 'lucide-react'

const NAV_LINKS = [
  { path: '/',        label: 'Overview',   icon: Activity },
  { path: '/explore', label: 'Markets',    icon: BarChart2 },
  { path: '/copilot', label: 'AI Copilot', icon: MessageSquare },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7,8,16,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 32 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}>
            <TrendingUp size={16} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: '#f0f1ff', lineHeight: 1 }}>
              FlowPulse
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', lineHeight: 1, marginTop: 2 }}>
              FDI INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_LINKS.map(({ path, label, icon: Icon }) => {
            const active = pathname === path
            return (
              <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 14px',
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#818cf8' : 'var(--text-secondary)',
                    background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(99,102,241,0.25)' : 'transparent'}`,
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}>
                  <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 100, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="pulse-dot" style={{ width: 7, height: 7 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#10b981', letterSpacing: '0.08em' }}>LIVE</span>
          </div>

          <motion.button whileTap={{ scale: 0.93 }}
            style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <Bell size={14} />
          </motion.button>

          <motion.button whileTap={{ scale: 0.93 }}
            style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <Settings size={14} />
          </motion.button>

          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: 'white', cursor: 'pointer' }}>
            A
          </div>
        </div>
      </div>
    </header>
  )
}