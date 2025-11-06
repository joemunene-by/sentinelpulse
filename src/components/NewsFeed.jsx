import { useState, useEffect } from 'react'
import { fetchNews } from '../utils/mockApi'
import ThreatCard from './ThreatCard'

const NewsFeed = ({ filters, onItemOpen, onTagClick }) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchNews(filters)
        setNews(data)
      } catch (err) {
        setError(err.message)
        console.error('Failed to load news:', err)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [filters])

  if (loading) {
    return (
      <section id="feed" className="py-8 px-4 sm:px-6 lg:px-8" aria-label="News feed" aria-live="polite">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Threat Intelligence Feed</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg p-5 border border-surface/50 animate-pulse">
                <div className="h-4 bg-base rounded w-1/4 mb-3" />
                <div className="h-6 bg-base rounded w-3/4 mb-2" />
                <div className="h-4 bg-base rounded w-full mb-2" />
                <div className="h-4 bg-base rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="feed" className="py-8 px-4 sm:px-6 lg:px-8" aria-label="News feed" aria-live="assertive">
        <div className="max-w-4xl mx-auto">
          <div className="bg-danger/20 border border-danger/50 rounded-lg p-6 text-center">
            <p className="text-danger font-medium">Error loading news feed</p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return (
      <section id="feed" className="py-8 px-4 sm:px-6 lg:px-8" aria-label="News feed" aria-live="polite">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Threat Intelligence Feed</h2>
          <div className="bg-surface rounded-lg p-12 border border-surface/50 text-center">
            <p className="text-gray-400 mb-2">No incidents match your filters.</p>
            <p className="text-sm text-gray-500">Try expanding the date range or clearing tags.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="feed" className="py-8 px-4 sm:px-6 lg:px-8" aria-label="News feed" aria-live="polite">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-white">
            Threat Intelligence Feed
          </h2>
          <span className="text-sm text-gray-400">
            {news.length} {news.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* News items list */}
        <div className="space-y-4">
          {news.map((item) => (
            <ThreatCard
              key={item.id}
              item={item}
              onOpen={onItemOpen}
              onTagClick={onTagClick}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsFeed
