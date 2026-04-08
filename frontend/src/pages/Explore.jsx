import { useState, useEffect, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, BarChart2, GitBranch, Shield, AlertCircle, Loader, TrendingUp, ArrowUpRight } from 'lucide-react'
import SupplyChain from '../components/SupplyChain'
import ReadinessScore from '../components/ReadinessScore'
import axios from 'axios'

const Heatmap = lazy(() => import('../components/Heatmap'))

const TABS = [
  { id: 'heatmap',   label: 'Heatmap',      icon: Map },
  { id: 'actions',   label: 'Actions',       icon: BarChart2 },
  { id: 'supply',    label: 'Supply Chain',  icon: GitBranch },
  { id: 'readiness', label: 'Readiness',     icon: Shield },
]

function ScoreRing({ score, size = 72 }) {
  const r = (size / 2) - 6
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#6366f1' : '#f59e0b'

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size/2}px ${size/2}px`, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, fill: color }}>
        {score}
      </text>
    </svg>
  )
}

export default function Explore() {
  const [params] = useSearchParams()
  const [sectors, setSectors]   = useState([])
  const [selected, setSelected] = useState(null)
  const [tab, setTab]           = useState('heatmap')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    axios.get('/api/sectors')
      .then(r => {
        if (Array.isArray(r.data)) {
          setSectors(r.data)
          const id = params.get('sector') || 'ev'
          setSelected(r.data.find(s => s.id === id) || r.data[0])
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh', flexDirection: 'column', gap: 14 }}>
      <Loader size={22} color="#6366f1" className="animate-spin" />
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading market data...</p>
    </div>
  )

  if (error) return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>
      <div style={{ padding: 24, borderRadius: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', gap: 14 }}>
        <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ fontWeight: 600, color: '#ef4444', fontSize: 13, marginBottom: 6 }}>Backend Connection Error</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', gap: 20 }}>

        {/* Sidebar */}
        <div style={{ width: 230, flexShrink: 0 }}>
          <div className="section-label" style={{ marginBottom: 12, paddingLeft: 4 }}>Sectors</div>
          <div className="card" style={{ padding: 6 }}>
            {sectors.map((sector) => {
              const active = selected?.id === sector.id
              const sc = sector.opportunity_score >= 85 ? '#10b981' : sector.opportunity_score >= 70 ? '#6366f1' : '#f59e0b'
              return (
                <motion.button
                  key={sector.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSelected(sector); setTab('heatmap') }}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '11px 12px', borderRadius: 10,
                    cursor: 'pointer',
                    background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(99,102,241,0.25)' : 'transparent'}`,
                    transition: 'all 0.15s', marginBottom: 2,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{sector.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#818cf8' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sector.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <div style={{ height: 3, flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${sector.opportunity_score}%`, background: sc, borderRadius: 2 }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: sc, flexShrink: 0 }}>{sector.opportunity_score}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {selected && (
            <>
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
                <ScoreRing score={selected.opportunity_score} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                      {selected.icon} {selected.name}
                    </h2>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>
                      <TrendingUp size={9} /> +{selected.growth_pct}% YoY
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {[
                      { label: 'FDI Inflow', value: `₹${(selected.fdi_inflow_cr / 100).toFixed(0)}Bn` },
                      { label: 'Opportunity Score', value: `${selected.opportunity_score}/100` },
                      { label: 'Volatility', value: `${(selected.volatility * 100).toFixed(0)}%` },
                      { label: 'Infra Score', value: `${selected.infrastructure_score}/100` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="tab-bar" style={{ marginBottom: 18 }}>
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button key={id} className={`tab-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
                    <Icon size={12} /> {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="card card-glow"
                  style={{ padding: 22 }}>

                  {tab === 'heatmap' && (
                    <Suspense fallback={
                      <div style={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexDirection: 'column' }}>
                        <Loader size={20} color="#6366f1" className="animate-spin" />
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Rendering India map...</p>
                      </div>
                    }>
                      <Heatmap sector={selected} />
                    </Suspense>
                  )}

                  {tab === 'actions' && (
                    <div>
                      <div className="section-label" style={{ marginBottom: 16 }}>SME Entry Recommendations</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selected.actions.map((action, i) => (
                          <motion.div key={i}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                            whileHover={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: '#818cf8' }}>
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{action}</p>
                            <ArrowUpRight size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'supply' && <SupplyChain sector={selected} />}
                  {tab === 'readiness' && <ReadinessScore />}

                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  )
}