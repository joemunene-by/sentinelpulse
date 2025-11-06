import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCopy, FiDownload, FiExternalLink } from 'react-icons/fi'
import { formatDateTime, getSeverityColor, getConfidenceColor } from '../utils/formatters'

const ArticleModal = ({ item, isOpen, onClose }) => {
  const modalRef = useRef(null)
  const [reducedMotion] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (isOpen) {
      // Focus trap
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose()
        }
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (!focusableElements) return

          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, onClose])

  if (!item) return null

  const handleCopyLink = () => {
    const url = window.location.href.split('#')[0] + `#article-${item.id}`
    navigator.clipboard.writeText(url).then(() => {
      // You could add a toast notification here
    })
  }

  const handleExportReport = () => {
    const report = {
      id: item.id,
      title: item.title,
      source: item.source,
      published_at: item.published_at,
      severity: item.severity,
      confidence: item.confidence,
      region: item.region,
      country: item.country,
      tags: item.tags,
      summary: item.summary,
      content: item.content,
      indicators: item.indicators,
      exported_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sentinelpulse-report-${item.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyIndicators = () => {
    const indicators = [
      ...(item.indicators?.ips || []),
      ...(item.indicators?.urls || []),
      ...(item.indicators?.hashes || [])
    ].join('\n')
    
    navigator.clipboard.writeText(indicators).then(() => {
      // You could add a toast notification here
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="bg-surface rounded-lg border border-surface/50 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-surface/50">
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-sm font-medium text-gray-400">{item.source}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-400">{formatDateTime(item.published_at)}</span>
                  </div>
                  <h2 id="modal-title" className="text-2xl font-heading font-bold text-white mb-3">
                    {item.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded ${getSeverityColor(item.severity)}`}>
                      {item.severity}
                    </span>
                    <span className={`text-sm font-mono ${getConfidenceColor(item.confidence)}`}>
                      Confidence: {item.confidence}%
                    </span>
                    {item.region && (
                      <span className="text-sm text-gray-400">
                        {item.region}{item.country && ` • ${item.country}`}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-teal"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-accent-teal/10 text-accent-teal rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Summary */}
                {item.summary && (
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-white mb-2">Summary</h3>
                    <p className="text-gray-300 leading-relaxed">{item.summary}</p>
                  </div>
                )}

                {/* Full Content */}
                {item.content && (
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-white mb-2">Full Report</h3>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </div>
                  </div>
                )}

                {/* Indicators */}
                {(item.indicators?.ips?.length > 0 || 
                  item.indicators?.urls?.length > 0 || 
                  item.indicators?.hashes?.length > 0) && (
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-white mb-3">Indicators of Compromise</h3>
                    <div className="bg-base rounded-lg p-4 space-y-4">
                      {item.indicators.ips && item.indicators.ips.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">IP Addresses</h4>
                          <div className="space-y-1">
                            {item.indicators.ips.map((ip, idx) => (
                              <code key={idx} className="block text-sm font-mono text-accent-teal">
                                {ip}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.indicators.urls && item.indicators.urls.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">URLs</h4>
                          <div className="space-y-1">
                            {item.indicators.urls.map((url, idx) => (
                              <code key={idx} className="block text-sm font-mono text-accent-teal break-all">
                                {url}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.indicators.hashes && item.indicators.hashes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">File Hashes</h4>
                          <div className="space-y-1">
                            {item.indicators.hashes.map((hash, idx) => (
                              <code key={idx} className="block text-sm font-mono text-accent-teal">
                                {hash}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Suggested Playbook */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-white mb-3">Suggested Response Actions</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Review network logs for indicators of compromise</li>
                    <li>Isolate affected systems from the network</li>
                    <li>Conduct a thorough security assessment</li>
                    <li>Update detection rules and signatures</li>
                    <li>Notify relevant stakeholders and security teams</li>
                  </ul>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between p-6 border-t border-surface/50 bg-base/50">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCopyIndicators}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-surface text-gray-300 rounded-md hover:bg-surface/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal"
                  >
                    <FiCopy size={16} />
                    <span>Copy Indicators</span>
                  </button>
                  <button
                    onClick={handleExportReport}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-accent-violet/20 text-accent-violet rounded-md hover:bg-accent-violet/30 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-violet"
                  >
                    <FiDownload size={16} />
                    <span>Export Report (JSON)</span>
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium bg-accent-teal/20 text-accent-teal rounded-md hover:bg-accent-teal/30 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ArticleModal
