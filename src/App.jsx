import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import HeroSummary from './components/HeroSummary'
import FiltersPanel from './components/FiltersPanel'
import NewsFeed from './components/NewsFeed'
import MetricCounters from './components/MetricCounters'
import IncidentTimeline from './components/IncidentTimeline'
import HeatmapGlobe from './components/HeatmapGlobe'
import ArticleModal from './components/ArticleModal'
import Footer from './components/Footer'
import { fetchNews } from './utils/mockApi'

function App() {
  const [filters, setFilters] = useState({
    timeRange: '24h',
    severities: [],
    regions: [],
    tags: [],
    searchText: ''
  })
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleArticleOpen = (article) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedArticle(null)
  }

  const handleTagClick = (tag) => {
    const currentTags = filters.tags || []
    if (!currentTags.includes(tag)) {
      setFilters({ ...filters, tags: [...currentTags, tag] })
    }
  }

  const handleCountryClick = (countryName) => {
    // Map country to region if needed
    const regionMap = {
      'United States': 'North America',
      'Canada': 'North America',
      'Germany': 'Europe',
      'United Kingdom': 'Europe',
      'France': 'Europe',
      'Switzerland': 'Europe',
      'Japan': 'Asia',
      'South Korea': 'Asia',
      'Singapore': 'Asia',
      'China': 'Asia',
      'Kenya': 'Africa'
    }
    
    const region = regionMap[countryName] || countryName
    const currentRegions = filters.regions || []
    if (!currentRegions.includes(region)) {
      setFilters({ ...filters, regions: [...currentRegions, region] })
    }
    
    // Scroll to feed
    setTimeout(() => {
      const feedSection = document.getElementById('feed')
      if (feedSection) {
        feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleIncidentClick = (incident) => {
    // Try to find related news article
    // In a real app, you'd match by ID or timestamp
    // For now, we'll just scroll to feed
    const feedSection = document.getElementById('feed')
    if (feedSection) {
      feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleExportSnapshot = async () => {
    try {
      const news = await fetchNews(filters)
      const snapshot = {
        exported_at: new Date().toISOString(),
        filters: filters,
        data: news,
        metadata: {
          total_items: news.length,
          export_version: '1.0'
        }
      }

      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sentinelpulse-snapshot-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export snapshot:', error)
      alert('Failed to export snapshot. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-base">
      <Nav />
      
      <main className="relative">
        {/* Hero/Summary Section */}
        <HeroSummary 
          filters={filters} 
          onExportSnapshot={handleExportSnapshot}
        />

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Filters */}
            <aside className="lg:col-span-3">
              <FiltersPanel 
                filters={filters} 
                onFiltersChange={handleFiltersChange}
              />
            </aside>

            {/* Center - Main Feed */}
            <div className="lg:col-span-6">
              <NewsFeed 
                filters={filters}
                onItemOpen={handleArticleOpen}
                onTagClick={handleTagClick}
              />
            </div>

            {/* Right Sidebar - Metrics */}
            <aside className="lg:col-span-3">
              <MetricCounters filters={filters} />
            </aside>
          </div>

          {/* Incident Timeline */}
          <IncidentTimeline 
            filters={filters}
            onIncidentClick={handleIncidentClick}
          />

          {/* Global Heatmap */}
          <HeatmapGlobe 
            filters={filters}
            onCountryClick={handleCountryClick}
          />
        </div>
      </main>

      {/* Article Modal */}
      <ArticleModal 
        item={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      {/* Footer */}
      <Footer />

      {/* About Section (for anchor link) */}
      <section id="about" className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">About SentinelPulse</h2>
          <div className="bg-surface rounded-lg p-8 border border-surface/50">
            <p className="text-gray-300 leading-relaxed mb-4">
              SentinelPulse is an enterprise-grade cybersecurity threat intelligence dashboard designed 
              to provide real-time visibility into global cyber threats. Built by CEO Joe Munene, this 
              platform aggregates and visualizes threat data from multiple sources, enabling security 
              teams to make informed decisions quickly.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The dashboard features real-time threat feeds, incident timelines, global heatmaps, and 
              comprehensive filtering capabilities. All data is currently mocked for demonstration purposes, 
              but the platform is designed to integrate with real threat intelligence APIs including 
              NewsAPI, VirusTotal, MISP, and Recorded Future.
            </p>
            <p className="text-gray-300 leading-relaxed">
              For inquiries or partnerships, please contact CEO Joe Munene at{' '}
              <a href="mailto:joemunene984@gmail.com" className="text-accent-teal hover:underline">
                joemunene984@gmail.com
              </a>
              {' '}or{' '}
              <a href="tel:+254718733968" className="text-accent-teal hover:underline">
                +254 718 733 968
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
