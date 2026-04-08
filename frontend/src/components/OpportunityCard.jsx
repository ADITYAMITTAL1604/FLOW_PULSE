import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function OpportunityCard({ sector, index }) {
  const navigate = useNavigate()

  const scoreColor =
    sector.opportunity_score >= 85 ? '#1d9e75' :
    sector.opportunity_score >= 70 ? '#3b8bd4' : '#ba7517'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, borderColor: '#3b8bd4' }}
      onClick={() => navigate(`/explore?sector=${sector.id}`)}
      className="card p-5 cursor-pointer transition-all"
      style={{ borderColor: '#1e1e2e' }}>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sector.icon}</span>
          <div>
            <h3 className="font-semibold text-white text-sm">{sector.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
              ₹{(sector.fdi_inflow_cr / 100).toFixed(0)}Bn FDI inflow
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: scoreColor }}>
            {sector.opportunity_score}
          </div>
          <div className="text-xs" style={{ color: '#64748b' }}>score</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: '#64748b' }}>
          <span>Opportunity Score</span>
          <span style={{ color: scoreColor }}>{sector.opportunity_score}/100</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#1e1e2e' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${sector.opportunity_score}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs" style={{ color: '#1d9e75' }}>
          <TrendingUp size={12} />
          <span>+{sector.growth_pct}% YoY</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: '#3b8bd4' }}>
          <span>Explore</span>
          <ArrowRight size={12} />
        </div>
      </div>

    </motion.div>
  )
}