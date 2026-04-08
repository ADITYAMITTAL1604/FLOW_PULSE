// CoPilotPage.jsx
import { motion } from 'framer-motion'
import { Bot, Zap, TrendingUp, Shield, BarChart2 } from 'lucide-react'
import CoPilot from '../components/CoPilot'

export default function CoPilotPage() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px', height: 'calc(100vh - 88px)', display: 'flex', gap: 20 }}>

      {/* Left info panel */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header card */}
        <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.06) 100%)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Bot size={22} color="white" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            AI Copilot
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Specialized in Indian FDI, PLI schemes & SME strategy
          </p>
        </div>

        {/* Capabilities */}
        <div className="card" style={{ padding: 16 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>What I can do</div>
          {[
            { icon: TrendingUp, label: 'Analyze FDI trends',        sub: 'Real-time sector intelligence' },
            { icon: Shield,     label: 'Match PLI schemes',          sub: 'Government scheme eligibility' },
            { icon: BarChart2,  label: 'SME strategy',               sub: 'Supply chain entry guidance' },
            { icon: Zap,        label: 'Opportunity scoring',         sub: 'Readiness & risk analysis' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={13} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>
              </div>
            </div>
          ))}
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 10, padding: '9px 0' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={13} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Market predictions</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>AI-powered forecasting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['EV Supply Chain', 'Semiconductors', 'PLI Schemes', 'Green Energy', 'MSME Credit', 'Defence'].map(tag => (
            <span key={tag} className="badge badge-accent" style={{ fontSize: 10 }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Chat panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card card-glow"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <CoPilot />
      </motion.div>

    </div>
  )
}
