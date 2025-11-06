import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { fetchNews } from '../utils/mockApi'

// Simple SVG-based world map as fallback
const WorldMapSVG = ({ incidents, onCountryClick }) => {
  // This is a simplified representation - in production, use a proper world map SVG
  const countries = [
    { code: 'US', name: 'United States', count: 0 },
    { code: 'DE', name: 'Germany', count: 0 },
    { code: 'JP', name: 'Japan', count: 0 },
    { code: 'GB', name: 'United Kingdom', count: 0 },
    { code: 'KR', name: 'South Korea', count: 0 },
    { code: 'CA', name: 'Canada', count: 0 },
    { code: 'FR', name: 'France', count: 0 },
    { code: 'SG', name: 'Singapore', count: 0 },
    { code: 'CH', name: 'Switzerland', count: 0 },
    { code: 'KE', name: 'Kenya', count: 0 },
    { code: 'CN', name: 'China', count: 0 },
  ]

  // Count incidents by country
  incidents.forEach(incident => {
    const country = countries.find(c => 
      incident.country === c.name || 
      incident.region === c.name
    )
    if (country) country.count++
  })

  const maxCount = Math.max(...countries.map(c => c.count), 1)

  const getIntensity = (count) => {
    if (count === 0) return 0
    return Math.min(1, count / maxCount)
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-4 gap-4 p-8">
        {countries.map((country) => {
          const intensity = getIntensity(country.count)
          const opacity = intensity * 0.8 + 0.2
          const color = intensity > 0.7 ? '#FF645A' : intensity > 0.4 ? '#FF9500' : '#00E6C3'
          
          return (
            <button
              key={country.code}
              onClick={() => onCountryClick(country.name)}
              className="relative group"
              aria-label={`${country.name}: ${country.count} incidents`}
            >
              <div
                className="w-24 h-24 rounded-lg border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`,
                  borderColor: country.count > 0 ? color : '#374151'
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-mono font-bold text-white">{country.count}</span>
                  <span className="text-xs text-gray-300 mt-1">{country.code}</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-base border border-surface/50 rounded px-2 py-1 text-xs text-white whitespace-nowrap">
                  {country.name}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const HeatmapGlobe = ({ filters, onCountryClick }) => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [webglAvailable, setWebglAvailable] = useState(false)
  const canvasRef = useRef(null)
  const [reducedMotion] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebglAvailable(!!gl)
    } catch (e) {
      setWebglAvailable(false)
    }
  }, [])

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(true)
      const data = await fetchNews({ ...filters, timeRange: '30d' })
      setIncidents(data)
      setLoading(false)
    }
    loadIncidents()
  }, [filters])

  const handleCountryClick = (countryName) => {
    if (onCountryClick) {
      onCountryClick(countryName)
    }
  }

  return (
    <section id="research" className="py-8 px-4 sm:px-6 lg:px-8" aria-label="Global threat heatmap">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-white mb-6">Global Threat Heatmap</h2>
        
        <div className="bg-surface rounded-lg p-6 border border-surface/50">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-gray-400">Loading heatmap...</div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.5 }}
              className="h-96 relative"
            >
              <WorldMapSVG incidents={incidents} onCountryClick={handleCountryClick} />
              
              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-base/90 backdrop-blur-sm rounded-lg p-4 border border-surface/50">
                <h3 className="text-sm font-medium text-white mb-2">Incident Density</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-danger/80" />
                    <span className="text-xs text-gray-300">High</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-orange-500/80" />
                    <span className="text-xs text-gray-300">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-accent-teal/80" />
                    <span className="text-xs text-gray-300">Low</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="mt-4 text-sm text-gray-400">
            <p>Click on a country to filter incidents by region. Hover to see incident counts.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeatmapGlobe
