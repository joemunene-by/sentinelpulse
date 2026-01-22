import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiBookmark, FiExternalLink } from 'react-icons/fi'
import { formatRelativeTime, getSeverityColor, getConfidenceColor } from '../utils/formatters'

const ThreatCard = ({ item, onTagClick, onBookmark, onOpen }) => {
  const [bookmarked, setBookmarked] = useState(() => {
    const saved = localStorage.getItem('bookmarks')
    return saved ? JSON.parse(saved).includes(item.id) : false
  })
  const [reducedMotion] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const handleBookmark = (e) => {
    e.stopPropagation()
    const saved = localStorage.getItem('bookmarks')
    const bookmarks = saved ? JSON.parse(saved) : []
    
    if (bookmarked) {
      const newBookmarks = bookmarks.filter(id => id !== item.id)
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
      setBookmarked(false)
    } else {
      bookmarks.push(item.id)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
      setBookmarked(true)
    }
    
    if (onBookmark) onBookmark(item.id, !bookmarked)
  }

  const handleTagClick = (e, tag) => {
    e.stopPropagation()
    if (onTagClick) onTagClick(tag)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
      onClick={() => onOpen(item)}
      className="bg-white/5 backdrop-blur-md rounded-lg p-5 border border-accent-teal/10 hover:border-accent-teal/50 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(item)
        }
      }}
      aria-label={`Open article: ${item.title}`}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-accent-teal/5 -mr-8 -mt-8 rotate-45 pointer-events-none" />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-[10px] font-mono font-medium text-accent-teal/80 uppercase tracking-wider">{item.source}</span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-[10px] font-mono text-gray-400 uppercase">{formatRelativeTime(item.published_at)}</span>
          </div>
          <h3 className="text-lg font-heading font-semibold text-white mb-2 group-hover:text-accent-teal transition-colors line-clamp-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
            {item.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {item.summary}
          </p>
        </div>
        <button
          onClick={handleBookmark}
          className="ml-4 p-2 text-gray-400 hover:text-accent-teal transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-teal"
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
        >
          <FiBookmark size={20} className={bookmarked ? 'fill-accent-teal text-accent-teal' : ''} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 relative z-10">
        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase tracking-tighter ${getSeverityColor(item.severity)}`}>
          {item.severity}
        </span>
        <span className={`text-[10px] font-mono uppercase tracking-widest ${getConfidenceColor(item.confidence)}`}>
          Confidence: {item.confidence}%
        </span>
        {item.region && (
          <span className="text-xs text-gray-400">
            {item.region}{item.country && ` • ${item.country}`}
          </span>
        )}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => handleTagClick(e, tag)}
              className="px-2 py-1 text-xs bg-accent-teal/10 text-accent-teal rounded hover:bg-accent-teal/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center text-xs text-gray-500">
        <span>Click to view details</span>
        <FiExternalLink className="ml-2" size={14} />
      </div>
    </motion.article>
  )
}

export default ThreatCard
