import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { fetchNews, fetchIncidents } from '../utils/mockApi'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const MetricCounter = ({ value, label, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [reducedMotion] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value)
      return
    }

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        step++
        current = Math.min(value, increment * step)
        setDisplayValue(Math.floor(current))

        if (step >= steps) {
          clearInterval(interval)
          setDisplayValue(value)
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay, reducedMotion])

  return (
    <div className="bg-surface rounded-lg p-4 border border-surface/50">
      <p className="text-2xl font-mono font-bold text-accent-teal mb-1">
        {displayValue.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
    </div>
  )
}

const MetricCounters = ({ filters }) => {
  const [metrics, setMetrics] = useState({
    incidents24h: 0,
    avgSeverity: 'Low',
    topSector: 'Unknown',
    flaggedIndicators: 0
  })
  const [attackTypes, setAttackTypes] = useState([])
  const [sectorDistribution, setSectorDistribution] = useState([])

  useEffect(() => {
    const loadMetrics = async () => {
      const [news, incidents] = await Promise.all([
        fetchNews({ ...filters, timeRange: '24h' }),
        fetchIncidents({ ...filters, timeRange: '24h' })
      ])

      // Calculate incidents in last 24h
      const incidents24h = incidents.length

      // Calculate average severity
      const severityValues = { Low: 1, Medium: 2, High: 3, Critical: 4 }
      const avgSeverityNum = incidents.length > 0
        ? incidents.reduce((sum, inc) => sum + (severityValues[inc.severity] || 2), 0) / incidents.length
        : 1
      const avgSeverity = Object.keys(severityValues).find(
        key => severityValues[key] === Math.round(avgSeverityNum)
      ) || 'Low'

      // Count attack types
      const typeCounts = {}
      news.forEach(item => {
        item.tags?.forEach(tag => {
          typeCounts[tag] = (typeCounts[tag] || 0) + 1
        })
      })
      const attackTypesData = Object.entries(typeCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

      // Sector distribution
      const sectorCounts = {}
      incidents.forEach(inc => {
        sectorCounts[inc.sector] = (sectorCounts[inc.sector] || 0) + 1
      })
      const sectorData = Object.entries(sectorCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

      // Top sector
      const topSector = sectorData.length > 0 ? sectorData[0].name : 'Unknown'

      // Count indicators
      const flaggedIndicators = news.reduce((sum, item) => {
        return sum + (item.indicators?.ips?.length || 0) +
               (item.indicators?.urls?.length || 0) +
               (item.indicators?.hashes?.length || 0)
      }, 0)

      setMetrics({
        incidents24h,
        avgSeverity,
        topSector,
        flaggedIndicators
      })
      setAttackTypes(attackTypesData)
      setSectorDistribution(sectorData)
    }

    loadMetrics()
  }, [filters])

  const COLORS = ['#00E6C3', '#7A4DFF', '#FF645A', '#FFD700', '#FF9500']

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-heading font-semibold text-white">Live Metrics</h3>
      
      {/* Counter Cards */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCounter value={metrics.incidents24h} label="Incidents (24h)" />
        <MetricCounter value={metrics.flaggedIndicators} label="Flagged Indicators" delay={200} />
      </div>

      {/* Average Severity */}
      <div className="bg-surface rounded-lg p-4 border border-surface/50">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Average Severity</p>
        <p className="text-xl font-heading font-bold text-white">{metrics.avgSeverity}</p>
      </div>

      {/* Top Sector */}
      <div className="bg-surface rounded-lg p-4 border border-surface/50">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Top Affected Sector</p>
        <p className="text-lg font-heading font-semibold text-accent-teal">{metrics.topSector}</p>
      </div>

      {/* Attack Types Distribution */}
      {attackTypes.length > 0 && (
        <div className="bg-surface rounded-lg p-4 border border-surface/50">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Attack Types</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={attackTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {attackTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sector Distribution */}
      {sectorDistribution.length > 0 && (
        <div className="bg-surface rounded-lg p-4 border border-surface/50">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Sector Distribution</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={sectorDistribution}>
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1B2430', border: '1px solid #00E6C3', borderRadius: '4px' }}
              />
              <Bar dataKey="value" fill="#00E6C3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default MetricCounters
