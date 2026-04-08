import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// We load Leaflet from CDN to avoid SSR issues
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

// India GeoJSON - fetched from public folder
const GEOJSON_URL = '/india-states.json'

// State name normalization
function normalize(s) {
  return (s || '').toLowerCase().trim()
    .replace(/\s+/g, ' ')
    .replace(/&/g, 'and')
}

function matchScore(geoName, scoreMap) {
  const gn = normalize(geoName)
  for (const [key, val] of Object.entries(scoreMap)) {
    const kn = normalize(key)
    if (gn === kn) return val
    if (gn.includes(kn) || kn.includes(gn)) return val
  }
  return 0
}

function scoreToHex(score) {
  if (!score || score === 0) return '#1e293b'
  if (score >= 90) return '#1d4ed8'
  if (score >= 80) return '#2563eb'
  if (score >= 70) return '#0891b2'
  if (score >= 60) return '#0d9488'
  if (score >= 50) return '#059669'
  return '#374151'
}

function scoreToLabel(score) {
  if (!score) return 'No data'
  if (score >= 90) return 'Very High'
  if (score >= 80) return 'High'
  if (score >= 70) return 'Good'
  if (score >= 60) return 'Moderate'
  return 'Low'
}

export default function Heatmap({ sector }) {
  const mapRef      = useRef(null)
  const leafletMap  = useRef(null)
  const geoLayer    = useRef(null)
  const [hovered,   setHovered]   = useState(null)
  const [ready,     setReady]     = useState(false)
  const [geoData,   setGeoData]   = useState(null)
  const [error,     setError]     = useState(null)

  // Load Leaflet CSS + JS once
  useEffect(() => {
    if (document.getElementById('leaflet-css')) {
      if (window.L) { setReady(true); return }
    }
    const link = document.createElement('link')
    link.id   = 'leaflet-css'
    link.rel  = 'stylesheet'
    link.href = LEAFLET_CSS
    document.head.appendChild(link)

    if (!window.L) {
      const script  = document.createElement('script')
      script.src    = LEAFLET_JS
      script.onload = () => setReady(true)
      script.onerror = () => setError('Leaflet failed to load. Check internet.')
      document.head.appendChild(script)
    } else {
      setReady(true)
    }
  }, [])

  // Fetch GeoJSON once
  useEffect(() => {
    if (geoData) return
    fetch(GEOJSON_URL)
      .then(r => {
        if (!r.ok) throw new Error(`GeoJSON fetch failed: ${r.status}`)
        return r.json()
      })
      .then(data => setGeoData(data))
      .catch(err => setError(`Could not load India map data.\n${err.message}\n\nRun: Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States" -OutFile "frontend/public/india-states.json"`))
  }, [])

  // Initialize Leaflet map
  useEffect(() => {
    if (!ready || !geoData || !mapRef.current || leafletMap.current) return

    const L = window.L

    const map = L.map(mapRef.current, {
      center:          [22, 82],
      zoom:            4.5,
      zoomControl:     true,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      attributionControl: false,
      preferCanvas:    true,
    })

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 10,
    }).addTo(map)

    leafletMap.current = map

    return () => {
      map.remove()
      leafletMap.current = null
      geoLayer.current   = null
    }
  }, [ready, geoData])

  // Add/update choropleth layer when sector changes
  useEffect(() => {
    if (!leafletMap.current || !geoData || !sector?.states) return

    const L = window.L
    const map = leafletMap.current

    // Remove old layer
    if (geoLayer.current) {
      map.removeLayer(geoLayer.current)
      geoLayer.current = null
    }

    const scoreMap = {}
    Object.entries(sector.states).forEach(([k, v]) => { scoreMap[k] = v })

    const layer = L.geoJSON(geoData, {
      style: (feature) => {
        const name  = feature.properties?.NAME_1 || feature.properties?.name || feature.properties?.ST_NM || ''
        const score = matchScore(name, scoreMap)
        return {
          fillColor:   scoreToHex(score),
          fillOpacity: score > 0 ? 0.82 : 0.35,
          color:       '#0f172a',
          weight:      1,
          opacity:     1,
        }
      },
      onEachFeature: (feature, lyr) => {
        const name  = feature.properties?.NAME_1 || feature.properties?.name || feature.properties?.ST_NM || 'Unknown'
        const score = matchScore(name, scoreMap)

        lyr.on({
          mouseover(e) {
            const l = e.target
            l.setStyle({ weight: 2.5, color: '#fff', fillOpacity: 1 })
            l.bringToFront()
            setHovered({ name, score })
          },
          mouseout(e) {
            layer.resetStyle(e.target)
            setHovered(null)
          },
        })

        // Tooltip
        lyr.bindTooltip(
          `<div style="background:#0f172a;border:1px solid ${scoreToHex(score)};border-radius:8px;padding:8px 12px;min-width:130px">
            <div style="font-weight:700;font-size:13px;color:white;margin-bottom:4px">${name}</div>
            ${score > 0
              ? `<div style="font-size:22px;font-weight:800;color:${scoreToHex(score)};line-height:1">${score}<span style="font-size:11px;color:#94a3b8;font-weight:400">/100</span></div>
                 <div style="font-size:10px;color:#64748b;margin-top:3px">${scoreToLabel(score)}</div>`
              : `<div style="font-size:11px;color:#475569">Not tracked</div>`
            }
          </div>`,
          { sticky: true, className: 'flowpulse-tooltip', opacity: 1 }
        )
      },
    }).addTo(map)

    geoLayer.current = layer

    // Add score labels as markers for tracked states
    Object.entries(sector.states).forEach(([stateName, score]) => {
      const STATE_CENTERS = {
        'Maharashtra':      [19.75, 75.71],
        'Gujarat':          [22.25, 71.19],
        'Tamil Nadu':       [11.12, 78.65],
        'Karnataka':        [15.31, 75.71],
        'Rajasthan':        [27.02, 74.21],
        'Uttar Pradesh':    [26.84, 80.94],
        'Haryana':          [29.05, 76.08],
        'Telangana':        [17.85, 79.10],
        'Andhra Pradesh':   [15.91, 79.74],
        'Punjab':           [30.90, 75.85],
        'Himachal Pradesh': [31.60, 77.10],
        'Uttarakhand':      [30.06, 79.01],
        'Madhya Pradesh':   [22.97, 78.65],
        'West Bengal':      [22.98, 87.85],
        'Odisha':           [20.94, 85.09],
        'Bihar':            [25.09, 85.31],
        'Jharkhand':        [23.61, 85.27],
        'Chhattisgarh':     [21.27, 81.86],
        'Kerala':           [10.85, 76.27],
        'Assam':            [26.20, 92.93],
        'Delhi':            [28.70, 77.10],
      }
      const coords = STATE_CENTERS[stateName]
      if (!coords) return

      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${scoreToHex(score)};color:white;font-size:11px;font-weight:800;padding:3px 6px;border-radius:5px;border:1.5px solid rgba(255,255,255,0.25);white-space:nowrap;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,0.5);font-family:Inter,sans-serif">${score}</div>`,
        iconAnchor: [16, 10],
      })
      L.marker(coords, { icon, interactive: false, zIndexOffset: 1000 }).addTo(map)
    })

    // Fit bounds to India
    try { map.fitBounds(layer.getBounds(), { padding: [20, 20] }) } catch (_) {}

  }, [geoData, sector])

  if (!sector?.states) return (
    <div style={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>
      Select a sector to view the heatmap
    </div>
  )

  const sorted = Object.entries(sector.states).sort((a, b) => b[1] - a[1])

  return (
    <div>
      {/* CSS overrides for Leaflet tooltip */}
      <style>{`
        .flowpulse-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .flowpulse-tooltip::before { display: none !important; }
        .leaflet-container { font-family: 'Inter', sans-serif; }
        .leaflet-control-zoom a { background: #12121a !important; color: #94a3b8 !important; border-color: #1e2a3a !important; }
        .leaflet-control-zoom a:hover { background: #1a2a4a !important; color: white !important; }
      `}</style>

      {/* Legend row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexWrap:'wrap', gap:6 }}>
        <p style={{ fontSize:11, color:'#64748b' }}>
          Hover any state · Color = opportunity score
        </p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {[
            ['No data','#1e293b'],
            ['< 60',   '#374151'],
            ['60–70',  '#059669'],
            ['70–80',  '#0d9488'],
            ['80–90',  '#2563eb'],
            ['90+',    '#1d4ed8'],
          ].map(([l,c]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:11, height:11, borderRadius:3, background:c, border:'1px solid #2d2d4e' }} />
              <span style={{ fontSize:10, color:'#94a3b8' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>

        {/* Map */}
        <div style={{ flex:1, borderRadius:12, overflow:'hidden', border:'1px solid #1e2a3a', position:'relative' }}>
          {error && (
            <div style={{ position:'absolute', inset:0, zIndex:10, background:'#06080f', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
              <div style={{ textAlign:'center', maxWidth:400 }}>
                <div style={{ fontSize:24, marginBottom:12 }}>🗺️</div>
                <p style={{ color:'#e24b4a', fontWeight:600, fontSize:13, marginBottom:8 }}>Map data not found</p>
                <p style={{ color:'#64748b', fontSize:11, lineHeight:1.6 }}>
                  Run this command in your terminal, then refresh:
                </p>
                <code style={{ display:'block', marginTop:10, padding:'10px 14px', background:'#0d0d15', borderRadius:8, fontSize:11, color:'#3b8bd4', textAlign:'left', lineHeight:1.8, wordBreak:'break-all' }}>
                  cd C:\PROJECTS\FLOW_PULSE\frontend\public<br/>
                  Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States" -OutFile "india-states.json"
                </code>
              </div>
            </div>
          )}
          {!ready && !error && (
            <div style={{ height:420, display:'flex', alignItems:'center', justifyContent:'center', background:'#06080f', flexDirection:'column', gap:12 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', border:'3px solid #3b8bd4', borderTopColor:'transparent', animation:'hspin 1s linear infinite' }} />
              <p style={{ color:'#64748b', fontSize:13 }}>Loading map engine...</p>
              <style>{`@keyframes hspin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          <div ref={mapRef} style={{ height:420, width:'100%', background:'#06080f' }} />
        </div>

        {/* Rankings */}
        <div style={{ width:175, flexShrink:0 }}>
          <p style={{ fontSize:10, color:'#64748b', fontWeight:600, letterSpacing:'0.06em', marginBottom:8 }}>
            STATE RANKINGS
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {sorted.map(([state, score], i) => (
              <motion.div
                key={state}
                initial={{ opacity:0, x:10 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'6px 8px', borderRadius:8,
                  background: hovered?.name === state ? '#1a1a2e' : 'transparent',
                  border: `1px solid ${hovered?.name === state ? '#3b8bd4' : 'transparent'}`,
                  transition:'all 0.15s',
                }}>
                <div style={{
                  width:20, height:20, borderRadius:'50%',
                  background: i < 3 ? scoreToHex(score) : '#1e1e2e',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:9, fontWeight:700, color:'white', flexShrink:0,
                }}>{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, color:'#e2e8f0', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {state}
                  </div>
                  <div style={{ height:3, background:'#1e1e2e', borderRadius:2, marginTop:3 }}>
                    <motion.div
                      initial={{ width:0 }}
                      animate={{ width:`${score}%` }}
                      transition={{ duration:0.8, delay: i*0.05 }}
                      style={{ height:'100%', background: scoreToHex(score), borderRadius:2 }}
                    />
                  </div>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color: scoreToHex(score), flexShrink:0 }}>
                  {score}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Info bar */}
      {hovered && (
        <motion.div
          initial={{ opacity:0, y:6 }}
          animate={{ opacity:1, y:0 }}
          style={{ marginTop:12, padding:'10px 16px', borderRadius:10, background:'#0d0d15', border:`1px solid ${scoreToHex(hovered.score)}`, display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'white' }}>{hovered.name}</div>
          {hovered.score > 0 ? (
            <>
              <div style={{ fontSize:20, fontWeight:800, color: scoreToHex(hovered.score) }}>{hovered.score}<span style={{ fontSize:11, color:'#64748b', fontWeight:400 }}>/100</span></div>
              <div style={{ fontSize:11, color:'#64748b' }}>{scoreToLabel(hovered.score)} opportunity</div>
            </>
          ) : (
            <div style={{ fontSize:11, color:'#64748b' }}>Not tracked for this sector</div>
          )}
        </motion.div>
      )}
    </div>
  )
}
