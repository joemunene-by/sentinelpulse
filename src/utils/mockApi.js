import sampleNews from '../data/sampleNews.json'
import sampleIncidents from '../data/sampleIncidents.json'
import { fetchCombinedNews } from '../api/realApi'

/**
 * Simulate API delay
 */
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Filter news items based on criteria
 */
const filterNews = (news, filters) => {
  return news.filter(item => {
    // Time range filter
    if (filters.timeRange) {
      const itemDate = new Date(item.published_at)
      const now = new Date()
      const hours = {
        '1h': 1,
        '24h': 24,
        '7d': 168,
        '30d': 720
      }[filters.timeRange]
      if (hours) {
        const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000)
        if (itemDate < cutoff) return false
      }
    }

    // Severity filter
    if (filters.severities && filters.severities.length > 0) {
      if (!filters.severities.includes(item.severity)) return false
    }

    // Region filter
    if (filters.regions && filters.regions.length > 0) {
      if (!filters.regions.includes(item.region)) return false
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => item.tags.includes(tag))
      if (!hasTag) return false
    }

    // Search text filter
    if (filters.searchText && filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase()
      const matchesTitle = item.title.toLowerCase().includes(searchLower)
      const matchesSummary = item.summary?.toLowerCase().includes(searchLower)
      const matchesContent = item.content?.toLowerCase().includes(searchLower)
      if (!matchesTitle && !matchesSummary && !matchesContent) return false
    }

    return true
  })
}

/**
 * Filter incidents based on criteria
 */
const filterIncidents = (incidents, filters) => {
  return incidents.filter(item => {
    // Time range filter
    if (filters.timeRange) {
      const itemDate = new Date(item.timestamp)
      const now = new Date()
      const hours = {
        '1h': 1,
        '24h': 24,
        '7d': 168,
        '30d': 720
      }[filters.timeRange]
      if (hours) {
        const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000)
        if (itemDate < cutoff) return false
      }
    }

    // Severity filter
    if (filters.severities && filters.severities.length > 0) {
      if (!filters.severities.includes(item.severity)) return false
    }

    // Region filter
    if (filters.regions && filters.regions.length > 0) {
      if (!filters.regions.includes(item.region)) return false
    }

    // Sector filter
    if (filters.sectors && filters.sectors.length > 0) {
      if (!filters.sectors.includes(item.sector)) return false
    }

    return true
  })
}

/**
 * Fetch news items with filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered news items
 */
export const fetchNews = async (filters = {}) => {
  // Try to fetch real news first
  try {
    const realNews = await fetchCombinedNews(filters)
    if (realNews && realNews.length > 0) {
      // Combine with mock data for demonstration
      const mockFiltered = filterNews(sampleNews, filters)
      const combined = [...realNews, ...mockFiltered]
      // Sort by date (newest first)
      return combined.sort((a, b) => 
        new Date(b.published_at) - new Date(a.published_at)
      )
    }
  } catch (error) {
    console.warn('Real API failed, using mock data:', error)
  }
  
  // Fallback to mock data
  await delay(300)
  const filtered = filterNews(sampleNews, filters)
  // Sort by date (newest first)
  return filtered.sort((a, b) => 
    new Date(b.published_at) - new Date(a.published_at)
  )
}

/**
 * Fetch incidents with filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered incidents
 */
export const fetchIncidents = async (filters = {}) => {
  await delay(300)
  const filtered = filterIncidents(sampleIncidents, filters)
  // Sort by timestamp (newest first)
  return filtered.sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  )
}

/**
 * Get a single news item by ID
 */
export const getNewsItem = async (id) => {
  await delay(150)
  return sampleNews.find(item => item.id === id) || null
}

/**
 * Get a single incident by ID
 */
export const getIncident = async (id) => {
  await delay(150)
  return sampleIncidents.find(item => item.id === id) || null
}

/**
 * Calculate global threat level
 */
export const getGlobalThreatLevel = async () => {
  await delay(100)
  const recentNews = sampleNews.filter(item => {
    const itemDate = new Date(item.published_at)
    const now = new Date()
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    return itemDate >= cutoff
  })

  const criticalCount = recentNews.filter(n => n.severity === 'Critical').length
  const highCount = recentNews.filter(n => n.severity === 'High').length

  if (criticalCount >= 3 || (criticalCount >= 1 && highCount >= 5)) {
    return { level: 'Critical', color: '#FF645A' }
  }
  if (criticalCount >= 1 || highCount >= 3) {
    return { level: 'High', color: '#FF9500' }
  }
  if (highCount >= 1) {
    return { level: 'Medium', color: '#FFD700' }
  }
  return { level: 'Low', color: '#00E6C3' }
}
