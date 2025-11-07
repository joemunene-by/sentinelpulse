/**
 * Real-time Threat Intelligence API Integration
 * 
 * This file provides real API integrations for threat intelligence.
 * Set up your API keys in a .env file
 */

const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

/**
 * Fetch real cybersecurity news from NewsAPI
 */
export const fetchRealNews = async (filters = {}) => {
  if (!USE_REAL_API || !NEWSAPI_KEY) {
    return null // Fall back to mock data
  }

  try {
    // NewsAPI query
    const query = filters.searchText || 'cybersecurity OR "cyber attack" OR ransomware OR malware OR "data breach" OR "zero day" OR phishing'
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=50&apiKey=${NEWSAPI_KEY}`
    
    // Using a CORS proxy (for development - use backend proxy in production)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    
    const response = await fetch(proxyUrl)
    const data = await response.json()
    
    if (data.contents) {
      const newsData = JSON.parse(data.contents)
      
      if (newsData.articles && newsData.articles.length > 0) {
        // Transform NewsAPI format to our format
        return newsData.articles.map((article, index) => {
          // Determine severity based on keywords
          const titleLower = (article.title || '').toLowerCase()
          const descLower = (article.description || '').toLowerCase()
          const contentLower = (article.content || '').toLowerCase()
          const allText = `${titleLower} ${descLower} ${contentLower}`
          
          let severity = 'Medium'
          let confidence = 60
          
          if (allText.includes('critical') || allText.includes('zero-day') || allText.includes('0-day') || allText.includes('critical vulnerability')) {
            severity = 'Critical'
            confidence = 85
          } else if (allText.includes('ransomware') || allText.includes('breach') || allText.includes('hack') || allText.includes('exploit')) {
            severity = 'High'
            confidence = 75
          } else if (allText.includes('alert') || allText.includes('warning') || allText.includes('advisory')) {
            severity = 'High'
            confidence = 70
          }
          
          // Extract tags
          const tags = []
          if (allText.includes('ransomware')) tags.push('ransomware')
          if (allText.includes('zero-day') || allText.includes('0-day')) tags.push('zero-day')
          if (allText.includes('phishing')) tags.push('phishing')
          if (allText.includes('malware')) tags.push('malware')
          if (allText.includes('breach') || allText.includes('leak') || allText.includes('exposed')) tags.push('breach')
          if (allText.includes('ddos') || allText.includes('denial of service')) tags.push('ddos')
          if (allText.includes('cloud') || allText.includes('aws') || allText.includes('azure')) tags.push('cloud')
          if (allText.includes('iot') || allText.includes('internet of things')) tags.push('iot')
          if (allText.includes('ai') || allText.includes('artificial intelligence') || allText.includes('machine learning')) tags.push('ai')
          if (allText.includes('supply chain') || allText.includes('supply-chain')) tags.push('supply-chain')
          if (allText.includes('apt') || allText.includes('advanced persistent threat')) tags.push('apt')
          if (tags.length === 0) tags.push('general')
          
          // Determine region (simplified - in production, use geolocation API)
          let region = 'Global'
          let country = 'Unknown'
          
          if (article.source?.name) {
            const sourceName = article.source.name.toLowerCase()
            if (sourceName.includes('us') || sourceName.includes('america') || sourceName.includes('united states')) {
              region = 'North America'
              country = 'United States'
            } else if (sourceName.includes('uk') || sourceName.includes('britain')) {
              region = 'Europe'
              country = 'United Kingdom'
            } else if (sourceName.includes('europe')) {
              region = 'Europe'
            } else if (sourceName.includes('asia')) {
              region = 'Asia'
            }
          }
          
          return {
            id: `real-${Date.now()}-${index}`,
            title: article.title || 'Untitled',
            source: article.source?.name || 'Unknown Source',
            published_at: article.publishedAt || new Date().toISOString(),
            region: region,
            country: country,
            severity: severity,
            confidence: confidence,
            tags: tags,
            summary: article.description || article.title || '',
            content: article.content || article.description || article.title || '',
            indicators: {
              ips: [],
              urls: [],
              hashes: []
            },
            url: article.url,
            imageUrl: article.urlToImage
          }
        })
      }
    }
    
    return []
  } catch (error) {
    console.error('Failed to fetch real news:', error)
    return null // Fall back to mock data
  }
}

/**
 * Fetch from CISA RSS Feed (free, no API key needed)
 */
export const fetchCISAFeed = async () => {
  try {
    const rssUrl = 'https://www.cisa.gov/news-events/cybersecurity-advisories/rss.xml'
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`
    
    const response = await fetch(proxyUrl)
    const data = await response.json()
    
    if (data.contents) {
      // Parse RSS XML
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(data.contents, 'text/xml')
      const items = xmlDoc.querySelectorAll('item')
      
      const feeds = []
      items.forEach((item, index) => {
        const title = item.querySelector('title')?.textContent || ''
        const description = item.querySelector('description')?.textContent || ''
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString()
        const link = item.querySelector('link')?.textContent || ''
        
        feeds.push({
          id: `cisa-${Date.now()}-${index}`,
          title: title,
          source: 'CISA',
          published_at: new Date(pubDate).toISOString(),
          region: 'North America',
          country: 'United States',
          severity: 'High', // CISA advisories are typically high severity
          confidence: 90,
          tags: ['advisory', 'government'],
          summary: description.substring(0, 200) || title,
          content: description || title,
          indicators: {
            ips: [],
            urls: [],
            hashes: []
          },
          url: link
        })
      })
      
      return feeds
    }
  } catch (error) {
    console.error('Failed to fetch CISA feed:', error)
  }
  
  return []
}

/**
 * Combine real news sources
 */
export const fetchCombinedNews = async (filters = {}) => {
  const [realNews, cisaFeeds] = await Promise.all([
    fetchRealNews(filters),
    fetchCISAFeed()
  ])
  
  let combined = []
  
  if (realNews && realNews.length > 0) {
    combined = [...combined, ...realNews]
  }
  
  if (cisaFeeds && cisaFeeds.length > 0) {
    combined = [...combined, ...cisaFeeds]
  }
  
  // Sort by date (newest first)
  combined.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
  
  return combined
}
