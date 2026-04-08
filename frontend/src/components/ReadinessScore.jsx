import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Loader, CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react'

const SECTORS = [
  { id: 'ev',            label: '⚡ Electric Vehicles' },
  { id: 'semiconductor', label: '🔬 Semiconductors' },
  { id: 'green_energy',  label: '🌱 Green Energy' },
  { id: 'defence',       label: '🛡️ Defence & Aerospace' },
  { id: 'pharma',        label: '💊 Pharmaceuticals' },
]

function scoreToColor(score) {
  if (score >= 70) return '#10b981'
  if (score >= 45) return '#f59e0b'
  return '#ef4444'
}

export default function ReadinessScore() {
  const [form, setForm]     = useState({ sector: 'ev', city: '', employees: '', capital_lakhs: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const submit = async () => {
    if (!form.city || !form.employees || !form.capital_lakhs) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/api/readiness-score', {
        sector: form.sector,
        city: form.city,
        employees: parseInt(form.employees),
        capital_lakhs: parseFloat(form.capital_lakhs),
      })
      setResult(res.data)
    } catch {
      setError('Error connecting to backend. Is it running?')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    const color = scoreToColor(result.score)
    const circ  = 2 * Math.PI * 48
    const offset = circ - (result.score / 100) * circ

    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>Readiness Assessment</div>

        {/* Score display */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '20px', borderRadius: 14, background: `${color}08`, border: `1px solid ${color}20`, marginBottom: 20 }}>
          <svg width={112} height={112} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle cx={56} cy={56} r={48} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
            <motion.circle
              cx={56} cy={56} r={48} fill="none" stroke={color} strokeWidth={6}
              strokeLinecap="round" strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
            />
            <text x={56} y={56} textAnchor="middle" dominantBaseline="middle"
              style={{ transform: 'rotate(90deg)', transformOrigin: '56px 56px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, fill: color }}>
              {result.score}%
            </text>
          </svg>

          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              {result.score >= 70 ? 'Ready to Enter' : result.score >= 45 ? 'Partially Ready' : 'Needs Preparation'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {result.sector} · {result.recommended_tier}
            </div>
            <span className={`badge ${result.score >= 70 ? 'badge-green' : result.score >= 45 ? 'badge-amber' : 'badge-red'}`} style={{ fontSize: 10 }}>
              {result.recommended_tier} recommended
            </span>
          </div>
        </div>

        {/* Gaps */}
        {result.gaps.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Gaps to Address</div>
            {result.gaps.map((gap, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', marginBottom: 8 }}>
                <AlertTriangle size={13} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#f59e0b', lineHeight: 1.5 }}>{gap}</p>
              </div>
            ))}
          </div>
        )}

        {/* Matched schemes */}
        {result.matched_schemes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Matched Government Schemes</div>
            {result.matched_schemes.map((scheme, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: 8 }}>
                <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{scheme.name}</div>
                  <div style={{ fontSize: 11, color: '#10b981' }}>{scheme.incentive}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {result.top_actions?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Next Steps</div>
            {result.top_actions.map((action, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', marginBottom: 6 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#818cf8' }}>{i+1}</div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{action}</p>
              </div>
            ))}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={() => setResult(null)}
          className="btn-ghost"
          style={{ width: '100%', justifyContent: 'center' }}>
          <RotateCcw size={13} /> Recalculate
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 14 }}>SME Readiness Assessment</div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
        Enter your business details to get a personalized readiness score, matched government schemes, and next steps.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>TARGET SECTOR</label>
          <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} className="input-field">
            {SECTORS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>CITY / STATE</label>
            <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="e.g. Haryana" className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>EMPLOYEES</label>
            <input type="number" value={form.employees} onChange={e => setForm({ ...form, employees: e.target.value })} placeholder="e.g. 12" className="input-field" />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>AVAILABLE CAPITAL (₹ LAKHS)</label>
          <input type="number" value={form.capital_lakhs} onChange={e => setForm({ ...form, capital_lakhs: e.target.value })} placeholder="e.g. 40" className="input-field" />
        </div>

        {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}

        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
          onClick={submit}
          disabled={loading}
          className="btn-primary"
          style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
          {loading
            ? <><Loader size={13} className="animate-spin" /> Calculating...</>
            : <>Calculate Readiness Score <ArrowRight size={13} /></>}
        </motion.button>
      </div>
    </div>
  )
}
