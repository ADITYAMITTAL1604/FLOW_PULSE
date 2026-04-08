import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react'
import axios from 'axios'

const DEMO_QUERIES = [
  "I run a steel components unit in Haryana, 12 employees, ₹40L capital. What should I do?",
  "Which EV supply chain tier is best for a small manufacturer in Pune with ₹30L?",
  "How can a pharma packaging SME in Gujarat benefit from PLI schemes?",
  "I want to enter solar energy from Rajasthan with ₹25L. Where do I start?",
]

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} style={{ height: 6 }} />

    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={i} style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13, marginTop: 12, marginBottom: 4, fontFamily: 'var(--font-display)' }}>
          {line.replace(/\*\*/g, '')}
        </p>
      )
    }

    if (line.startsWith('- ')) {
      return (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, paddingLeft: 4 }}>
          <span style={{ color: '#6366f1', marginTop: 1, flexShrink: 0 }}>›</span>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{line.slice(2)}</p>
        </div>
      )
    }

    if (line.includes('**')) {
      const parts = line.split('**')
      return (
        <p key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 3 }}>
          {parts.map((p, j) => j % 2 === 1
            ? <strong key={j} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p}</strong>
            : p
          )}
        </p>
      )
    }

    return <p key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 3 }}>{line}</p>
  })
}

export default function CoPilot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello! I'm your FlowPulse AI Copilot — specialized in Indian FDI intelligence, PLI schemes, and SME strategy.\n\nTell me about your business — sector, location, team size, and available capital — and I'll give you a specific, actionable plan."
  }])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)
    try {
      const res = await axios.post('/api/copilot', { message: msg, context: {} })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Please check your OpenRouter API key in backend/.env and restart the server."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Demo chips */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Sparkles size={12} color="#818cf8" />
          <span className="section-label">Try a query</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {DEMO_QUERIES.map((q, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={() => send(q)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 11,
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
                textAlign: 'left',
                maxWidth: 260,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#818cf8' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
              {q.length > 55 ? q.slice(0, 55) + '…' : q}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>

              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.1))'
                  : 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.1))',
                border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {msg.role === 'user'
                  ? <User size={14} color="#818cf8" />
                  : <Bot size={14} color="#10b981" />}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                background: msg.role === 'user'
                  ? 'rgba(99,102,241,0.12)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
              }}>
                {msg.role === 'user'
                  ? <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>{msg.content}</p>
                  : formatMessage(msg.content)
                }
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.1))', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={14} color="#10b981" />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '4px 14px 14px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Loader size={13} color="#6366f1" className="animate-spin" />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Analyzing FDI data...</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Describe your business — sector, location, capital available..."
              rows={1}
              style={{
                width: '100%',
                padding: '11px 16px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                outline: 'none',
                resize: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                lineHeight: 1.5,
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: loading || !input.trim()
                ? 'rgba(99,102,241,0.2)'
                : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: !loading && input.trim() ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}>
            <Send size={16} color="white" />
          </motion.button>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, paddingLeft: 4 }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
