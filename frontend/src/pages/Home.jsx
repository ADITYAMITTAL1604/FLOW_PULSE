import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, ArrowRight, ArrowUpRight, Zap, Shield, BarChart2, Activity, ChevronRight } from 'lucide-react'
import axios from 'axios'

function StatCard({ label, value, sub, change, color, delay, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card card-glow"
      style={{ cursor: 'default' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} strokeWidth={2} />
        </div>
        {change && (
          <span className="badge badge-green" style={{ fontSize: 10 }}>
            <ArrowUpRight size={9} /> {change}
          </span>
        )}
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: color, lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
    </motion.div>
  )
}

function SectorRow({ sector, index, onClick }) {
  const score = sector.opportunity_score
  const scoreColor = score >= 85 ? '#10b981' : score >= 70 ? '#6366f1' : '#f59e0b'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 20px',
        borderRadius: 12,
        cursor: 'pointer',
        border: '1px solid transparent',
        transition: 'all 0.2s ease',
        background: 'transparent',
      }}
      whileHover={{ background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.15)' }}>

      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
        {sector.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{sector.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>₹{(sector.fdi_inflow_cr / 100).toFixed(0)}Bn FDI · +{sector.growth_pct}% YoY</div>
      </div>

      <div style={{ width: 120, flexShrink: 0 }}>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: index * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}99)`, borderRadius: 2 }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0, width: 48 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: scoreColor }}>{score}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>/100</div>
      </div>

      <ChevronRight size={14} color="var(--text-muted)" />
    </motion.div>
  )
}

export default function Home() {
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/sectors').then(r => {
      if (Array.isArray(r.data)) setSectors(r.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const STATS = [
    { label: 'Total FDI Tracked',    value: '₹2.55T', sub: 'Across 5 high-growth sectors', change: '+12.4%', color: '#6366f1', icon: Activity },
    { label: 'SME Entry Points',     value: '240+',   sub: 'Actionable opportunities mapped', change: '+34', color: '#10b981', icon: TrendingUp },
    { label: 'Govt Schemes Active',  value: '8',      sub: 'PLI, MSME, CGTMSE & more', color: '#f59e0b', icon: Shield },
    { label: 'AI Insights Generated',value: '1,240+', sub: 'Business recommendations', change: '+180', color: '#06b6d4', icon: Zap },
  ]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 40 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span className="badge badge-accent">
            <Zap size={9} /> FDI Intelligence Platform
          </span>
          <span className="badge badge-green">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Real-time Data
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: 'var(--text-primary)',
              marginBottom: 14,
            }}>
              Where Capital Flows,<br />
              <span className="text-gradient">Opportunity Follows.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7, fontWeight: 300 }}>
              AI-powered FDI intelligence that converts complex economic data into clear,
              actionable business opportunities for India's 63 million SMEs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/explore" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn-primary">
                <BarChart2 size={14} /> Explore Markets <ArrowRight size={14} />
              </motion.button>
            </Link>
            <Link to="/copilot" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn-ghost">
                Ask AI Copilot
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
        {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.08} />)}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>

        {/* Sectors panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card card-glow">

          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="section-label" style={{ marginBottom: 4 }}>Live Opportunities</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>
                High-Signal FDI Sectors
              </h2>
            </div>
            <Link to="/explore" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
                View All <ArrowRight size={12} />
              </button>
            </Link>
          </div>

          <div style={{ padding: '8px 0' }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 20px', alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: 4, marginBottom: 6 }} />
                    <div style={{ height: 10, width: '60%', background: 'rgba(255,255,255,0.03)', borderRadius: 4 }} />
                  </div>
                </div>
              ))
            ) : (
              sectors.map((s, i) => (
                <SectorRow
                  key={s.id}
                  sector={s}
                  index={i}
                  onClick={() => window.location.href = `/explore?sector=${s.id}`}
                />
              ))
            )}
          </div>
        </motion.div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Market pulse */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="card card-glow"
            style={{ padding: 20 }}>

            <div className="section-label" style={{ marginBottom: 12 }}>Market Pulse</div>

            {[
              { label: 'EV Sector FDI',        value: '+34%',  sub: 'YoY growth',        color: '#10b981' },
              { label: 'Semiconductor Inflow',  value: '₹765B', sub: 'Current cycle',     color: '#6366f1' },
              { label: 'Green Energy',          value: '83/100',sub: 'Opportunity score', color: '#06b6d4' },
              { label: 'Defence PLI Active',    value: '₹10B',  sub: 'Disbursed to SMEs', color: '#f59e0b' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{item.sub}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: item.color }}>{item.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* AI Copilot CTA */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            style={{
              borderRadius: 16,
              padding: 22,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.08) 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}>

            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

            <div className="section-label" style={{ marginBottom: 10, color: '#818cf8' }}>AI POWERED</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Your Business Copilot
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              Get personalized FDI entry strategies, PLI scheme matching, and supply chain recommendations in seconds.
            </p>
            <Link to="/copilot" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Launch Copilot <ArrowRight size={13} />
              </button>
            </Link>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
            style={{ padding: 20 }}>
            <div className="section-label" style={{ marginBottom: 14 }}>India FDI Snapshot</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'GDP Contribution', value: '30%', sub: 'from SMEs' },
                { label: 'Active SMEs',      value: '63M+', sub: 'in India' },
                { label: 'PLI Schemes',      value: '14',   sub: 'active sectors' },
                { label: 'FDI Inflow FY24',  value: '$71B', sub: 'total' },
              ].map((item, i) => (
                <div key={item.label} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{item.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', opacity: 0.6 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ marginTop: 28, padding: '18px 24px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          63 million SMEs · ₹255T in tracked FDI · 8 active government schemes
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600 }} className="text-gradient">
          Bloomberg-grade intelligence for every Indian SME.
        </p>
      </motion.div>
    </div>
  )
}
