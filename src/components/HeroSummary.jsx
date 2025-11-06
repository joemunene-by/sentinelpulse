import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchNews, getGlobalThreatLevel } from '../utils/mockApi'
import { formatRelativeTime } from '../utils/formatters'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

const HeroSummary = ({ filters, onExportSnapshot }) => {
  const [threatLevel, setThreatLevel] = useState({ level: 'Low', color: '#00E6C3' })
  const [topHeadlines, setTopHeadlines] = useState([])
  const [trendData, setTrendData] = useState([])
  const [reducedMotion] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const loadData = async () => {
      const [level, news] = await Promise.all([
        getGlobalThreatLevel(),
        fetchNews({ ...filters, timeRange: '24h' })
      ])
      
      setThreatLevel(level)
      setTopHeadlines(news.slice(0, 3))
      
      // Generate trend data (last 24 hours)
      const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date()
        hour.setHours(hour.getHours() - (23 - i))
        return hour
      })
      
      const trend = hours.map(hour => {
        const count = news.filter(item => {
          const itemDate = new Date(item.published_at)
          return itemDate >= hour && itemDate < new Date(hour.getTime() + 60 * 60 * 1000)
        }).length
        return count
      })
      
      setTrendData(trend)
    }
    
    loadData()
    const interval = setInterval(loadData, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [filters])

  const getThreatBadgeClass = (level) => {
    const classes = {
      Low: 'bg-green-500/20 text-green-400 border-green-500/50',
      Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      High: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      Critical: 'bg-danger/20 text-danger border-danger/50'
    }
    return classes[level] || classes.Low
  }

  return (
    <section id="dashboard" className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-base to-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Threat Level Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5 }}
            className="lg:col-span-1 bg-surface rounded-lg p-6 border border-surface/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Global Threat Level
              </h2>
              {threatLevel.level === 'High' || threatLevel.level === 'Critical' ? (
                <motion.div
                  animate={reducedMotion ? {} : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: threatLevel.color }}
                />
              ) : null}
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 ${getThreatBadgeClass(threatLevel.level)}`}>
              <span className="text-2xl font-heading font-bold">{threatLevel.level}</span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Incident Trend (24h)</p>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={trendData.map((v, i) => ({ value: v, index: i }))}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={threatLevel.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-10 bg-surface/50 rounded animate-pulse" />
              )}
            </div>
          </motion.div>

          {/* Top Headlines */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-semibold text-white">Top Headlines</h2>
              <button
                onClick={onExportSnapshot}
                className="px-4 py-2 text-sm font-medium bg-accent-violet/20 text-accent-violet rounded-md hover:bg-accent-violet/30 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-violet"
              >
                Export Snapshot
              </button>
            </div>
            <div className="space-y-3">
              {topHeadlines.map((headline, index) => (
                <motion.div
                  key={headline.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3, delay: index * 0.1 }}
                  className="bg-surface rounded-lg p-4 border border-surface/50 hover:border-accent-teal/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white mb-1 line-clamp-2">
                        {headline.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span>{headline.source}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(headline.published_at)}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${headline.severity === 'Critical' ? 'bg-danger/20 text-danger' : headline.severity === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {headline.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {topHeadlines.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No headlines available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSummary
