// SupplyChain.jsx
import { motion } from 'framer-motion'
import { ArrowDown, CheckCircle, XCircle } from 'lucide-react'

export function SupplyChain({ sector }) {
  if (!sector?.supply_chain) return null

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 14 }}>Supply Chain Entry Points</div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
        Green tiers represent realistic SME entry points. Higher tiers require more capital but offer better margins.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {sector.supply_chain.map((tier, i) => (
          <div key={i}>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              style={{
                display: 'flex', gap: 16, padding: '18px 20px',
                borderRadius: 14,
                background: tier.sme_fit
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(6,182,212,0.03))'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${tier.sme_fit ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
              }}>

              {/* Tier badge */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: tier.sme_fit
                  ? 'linear-gradient(135deg, #10b981, #06b6d4)'
                  : 'rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: tier.sme_fit ? '0 0 16px rgba(16,185,129,0.3)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: tier.sme_fit ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>T</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: tier.sme_fit ? 'white' : 'var(--text-secondary)', lineHeight: 1 }}>{tier.tier}</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {tier.role}
                  </h3>
                  {tier.sme_fit ? (
                    <span className="badge badge-green" style={{ fontSize: 10 }}>
                      <CheckCircle size={9} /> SME Fit
                    </span>
                  ) : (
                    <span className="badge badge-red" style={{ fontSize: 10 }}>
                      <XCircle size={9} /> Enterprise Only
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{tier.examples}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Entry barrier:</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                    color: tier.entry_barrier === 'Low' ? '#10b981'
                      : tier.entry_barrier === 'Medium' ? '#f59e0b'
                      : '#ef4444'
                  }}>
                    {tier.entry_barrier}
                  </span>
                </div>
              </div>
            </motion.div>

            {i < sector.supply_chain.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                <ArrowDown size={14} color="var(--text-muted)" style={{ opacity: 0.4 }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SupplyChain
