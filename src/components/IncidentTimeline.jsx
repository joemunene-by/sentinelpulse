import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { fetchIncidents } from '../utils/mockApi'
import { formatRelativeTime, getSeverityColor } from '../utils/formatters'

const IncidentTimeline = ({ filters, onIncidentClick }) => {
  const [incidents, setIncidents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const timelineRef = useRef(null)
  const [reducedMotion] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const loadIncidents = async () => {
      const data = await fetchIncidents({ ...filters, timeRange: '7d' })
      setIncidents(data)
    }
    loadIncidents()
  }, [filters])

  // Group incidents by date
  const groupedIncidents = incidents.reduce((acc, incident) => {
    const date = new Date(incident.timestamp).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(incident)
    return acc
  }, {})

  const dates = Object.keys(groupedIncidents).sort((a, b) => new Date(b) - new Date(a))

  const handleIncidentClick = (incident) => {
    setSelectedDate(incident.timestamp)
    if (onIncidentClick) {
      onIncidentClick(incident)
      // Scroll to feed
      const feedSection = document.getElementById('feed')
      if (feedSection) {
        feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  if (incidents.length === 0) {
    return (
      <section id="incidents" className="py-8 px-4 sm:px-6 lg:px-8" aria-label="Incident timeline">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Incident Timeline</h2>
          <div className="bg-surface rounded-lg p-12 border border-surface/50 text-center">
            <p className="text-gray-400">No incidents found for the selected filters.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="incidents" className="py-8 px-4 sm:px-6 lg:px-8" aria-label="Incident timeline">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-white mb-6">Incident Timeline</h2>
        
        <div className="bg-surface rounded-lg p-6 border border-surface/50 overflow-x-auto">
          <div ref={timelineRef} className="min-w-max">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-accent-teal/30" />

              {/* Timeline events */}
              <div className="space-y-8">
                {dates.map((date, dateIndex) => (
                  <div key={date} className="relative pl-12">
                    {/* Date marker */}
                    <div className="absolute left-0 top-0">
                      <div className="w-8 h-8 bg-accent-teal rounded-full flex items-center justify-center border-4 border-base">
                        <div className="w-2 h-2 bg-accent-teal rounded-full" />
                      </div>
                    </div>

                    {/* Date label */}
                    <div className="mb-4">
                      <h3 className="text-lg font-heading font-semibold text-white">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                    </div>

                    {/* Incidents for this date */}
                    <div className="space-y-3">
                      {groupedIncidents[date].map((incident) => (
                        <motion.button
                          key={incident.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: reducedMotion ? 0 : 0.3 }}
                          onClick={() => handleIncidentClick(incident)}
                          className={`w-full text-left p-4 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-accent-teal ${
                            selectedDate === incident.timestamp
                              ? 'bg-accent-teal/20 border-accent-teal'
                              : 'bg-base border-surface/50 hover:border-accent-teal/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-base font-heading font-semibold text-white mb-2">
                                {incident.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(incident.severity)}`}>
                                  {incident.severity}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {incident.region} • {incident.sector}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatRelativeTime(incident.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {incident.description}
                              </p>
                            </div>
                            <div className="ml-4 text-right">
                              <span className="text-xs text-gray-400">Affected:</span>
                              <p className="text-lg font-mono font-bold text-accent-teal">
                                {incident.affected_entities}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IncidentTimeline
