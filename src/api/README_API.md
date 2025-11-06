# API Integration Guide

This document explains how to replace the mock API with real threat intelligence data sources.

## Current Implementation

The application currently uses mock data from:
- `src/data/sampleNews.json`
- `src/data/sampleIncidents.json`
- `src/utils/mockApi.js` (simulates API calls)

## Replacing with Real APIs

### Step 1: Create API Wrapper Functions

Create a new file `src/api/newsApi.js`:

```javascript
/**
 * NewsAPI Integration
 * Sign up at https://newsapi.org/
 * Get your API key and add it to .env file as VITE_NEWSAPI_KEY
 */

const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY
const NEWSAPI_BASE = 'https://newsapi.org/v2'

export const fetchNewsFromAPI = async (filters = {}) => {
  try {
    // Note: NewsAPI requires CORS proxy for browser requests
    // Use a proxy service like https://cors-anywhere.herokuapp.com/
    // or configure your backend to proxy requests
    
    const query = filters.searchText || 'cybersecurity'
    const response = await fetch(
      `${NEWSAPI_BASE}/everything?q=${encodeURIComponent(query)}&apiKey=${NEWSAPI_KEY}&sortBy=publishedAt&pageSize=100`
    )
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Transform NewsAPI format to our format
    return data.articles.map(article => ({
      id: `np-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title,
      source: article.source.name,
      published_at: article.publishedAt,
      region: 'Global', // NewsAPI doesn't provide region, you may need another service
      country: 'Unknown',
      severity: 'Medium', // You'll need to classify this
      confidence: 70,
      tags: extractTags(article.title + ' ' + article.description),
      summary: article.description,
      content: article.content || article.description,
      indicators: {
        ips: [],
        urls: [],
        hashes: []
      }
    }))
  } catch (error) {
    console.error('Failed to fetch news:', error)
    throw error
  }
}

// Helper to extract tags from text
function extractTags(text) {
  const tagKeywords = {
    'ransomware': ['ransomware', 'ransom'],
    'zero-day': ['zero-day', 'zero day', '0-day'],
    'phishing': ['phishing', 'phish'],
    'malware': ['malware', 'trojan', 'virus'],
    'breach': ['breach', 'data breach', 'leak'],
    'ddos': ['ddos', 'denial of service'],
    'apt': ['apt', 'advanced persistent threat'],
    'cloud': ['cloud', 'aws', 'azure', 'gcp'],
    'iot': ['iot', 'internet of things'],
    'supply-chain': ['supply chain', 'supply-chain']
  }
  
  const textLower = text.toLowerCase()
  const foundTags = []
  
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      foundTags.push(tag)
    }
  }
  
  return foundTags.length > 0 ? foundTags : ['general']
}
```

### Step 2: VirusTotal API Integration

Create `src/api/virusTotal.js`:

```javascript
/**
 * VirusTotal API Integration
 * Sign up at https://www.virustotal.com/
 * Get your API key and add it to .env as VITE_VIRUSTOTAL_KEY
 */

const VIRUSTOTAL_KEY = import.meta.env.VITE_VIRUSTOTAL_KEY
const VIRUSTOTAL_BASE = 'https://www.virustotal.com/api/v3'

export const checkIndicators = async (indicators) => {
  const results = {}
  
  // Check IPs
  if (indicators.ips && indicators.ips.length > 0) {
    for (const ip of indicators.ips) {
      try {
        const response = await fetch(`${VIRUSTOTAL_BASE}/ip_addresses/${ip}`, {
          headers: {
            'x-apikey': VIRUSTOTAL_KEY
          }
        })
        if (response.ok) {
          const data = await response.json()
          results[ip] = data.data.attributes.last_analysis_stats
        }
      } catch (error) {
        console.error(`Failed to check IP ${ip}:`, error)
      }
    }
  }
  
  // Check hashes
  if (indicators.hashes && indicators.hashes.length > 0) {
    for (const hash of indicators.hashes) {
      try {
        const response = await fetch(`${VIRUSTOTAL_BASE}/files/${hash}`, {
          headers: {
            'x-apikey': VIRUSTOTAL_KEY
          }
        })
        if (response.ok) {
          const data = await response.json()
          results[hash] = data.data.attributes.last_analysis_stats
        }
      } catch (error) {
        console.error(`Failed to check hash ${hash}:`, error)
      }
    }
  }
  
  return results
}
```

### Step 3: MISP Integration

Create `src/api/misp.js`:

```javascript
/**
 * MISP (Malware Information Sharing Platform) Integration
 * MISP requires a backend proxy due to CORS and authentication
 * Configure your backend to proxy MISP API requests
 */

const MISP_BASE = import.meta.env.VITE_MISP_BASE_URL
const MISP_KEY = import.meta.env.VITE_MISP_API_KEY

export const fetchMISPEvents = async (filters = {}) => {
  try {
    // Note: MISP typically requires backend proxy
    const response = await fetch(`${MISP_BASE}/events/index`, {
      method: 'POST',
      headers: {
        'Authorization': MISP_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        limit: 50,
        page: 1,
        ...filters
      })
    })
    
    if (!response.ok) {
      throw new Error(`MISP error: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Transform MISP format to our format
    return data.Event.map(event => ({
      id: `misp-${event.id}`,
      title: event.info,
      source: 'MISP',
      published_at: event.date,
      severity: mapMISPSeverity(event.threat_level_id),
      confidence: event.analysis,
      tags: event.Tag?.map(t => t.name) || [],
      summary: event.info,
      indicators: extractMISPIndicators(event)
    }))
  } catch (error) {
    console.error('Failed to fetch MISP events:', error)
    throw error
  }
}

function mapMISPSeverity(levelId) {
  const map = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Critical'
  }
  return map[levelId] || 'Medium'
}

function extractMISPIndicators(event) {
  const indicators = { ips: [], urls: [], hashes: [] }
  
  if (event.Attribute) {
    event.Attribute.forEach(attr => {
      switch (attr.type) {
        case 'ip-dst':
        case 'ip-src':
          indicators.ips.push(attr.value)
          break
        case 'url':
          indicators.urls.push(attr.value)
          break
        case 'sha256':
        case 'md5':
          indicators.hashes.push(attr.value)
          break
      }
    })
  }
  
  return indicators
}
```

### Step 4: Recorded Future Integration

Create `src/api/recordedFuture.js`:

```javascript
/**
 * Recorded Future API Integration
 * Requires API token from Recorded Future
 * Add to .env as VITE_RECORDEDFUTURE_TOKEN
 */

const RF_TOKEN = import.meta.env.VITE_RECORDEDFUTURE_TOKEN
const RF_BASE = 'https://api.recordedfuture.com/v2'

export const fetchThreatIntelligence = async (filters = {}) => {
  try {
    const response = await fetch(`${RF_BASE}/threat/intelligence`, {
      headers: {
        'X-RFToken': RF_TOKEN,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Recorded Future error: ${response.statusText}`)
    }
    
    const data = await response.json()
    // Transform to our format
    return data.data.map(item => ({
      id: `rf-${item.id}`,
      title: item.title,
      source: 'Recorded Future',
      published_at: item.published,
      severity: item.riskScore > 80 ? 'Critical' : item.riskScore > 60 ? 'High' : 'Medium',
      confidence: item.riskScore,
      tags: item.tags || [],
      summary: item.summary,
      indicators: item.indicators || { ips: [], urls: [], hashes: [] }
    }))
  } catch (error) {
    console.error('Failed to fetch Recorded Future data:', error)
    throw error
  }
}
```

### Step 5: Update mockApi.js to Use Real APIs

Modify `src/utils/mockApi.js` to conditionally use real APIs:

```javascript
import { fetchNewsFromAPI } from '../api/newsApi'
import { fetchMISPEvents } from '../api/misp'
import sampleNews from '../data/sampleNews.json'

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'

export const fetchNews = async (filters = {}) => {
  if (USE_REAL_API && import.meta.env.VITE_NEWSAPI_KEY) {
    try {
      return await fetchNewsFromAPI(filters)
    } catch (error) {
      console.error('Real API failed, falling back to mock data:', error)
      // Fallback to mock
    }
  }
  
  // Use mock data
  // ... existing mock implementation
}
```

### Step 6: Environment Variables

Create `.env` file:

```env
# API Keys
VITE_NEWSAPI_KEY=your_newsapi_key_here
VITE_VIRUSTOTAL_KEY=your_virustotal_key_here
VITE_MISP_BASE_URL=https://your-misp-instance.com
VITE_MISP_API_KEY=your_misp_api_key
VITE_RECORDEDFUTURE_TOKEN=your_rf_token

# Feature flags
VITE_USE_REAL_API=false
```

### Step 7: CORS and Proxy Considerations

**Important**: Many APIs don't allow direct browser requests due to CORS. You have two options:

1. **Backend Proxy**: Create a simple backend (Node.js/Express) that proxies API requests
2. **CORS Proxy Service**: Use a service like `https://cors-anywhere.herokuapp.com/` (not recommended for production)

For production, always use a backend proxy.

### Step 8: Rate Limits

Be aware of API rate limits:
- **NewsAPI**: 100 requests/day (free tier), 250 requests/day (paid)
- **VirusTotal**: 4 requests/minute (free tier), higher limits (paid)
- **MISP**: Depends on instance configuration
- **Recorded Future**: Depends on subscription tier

Implement rate limiting and caching in your proxy if needed.

## Testing

1. Start with one API at a time
2. Test with `VITE_USE_REAL_API=true` locally
3. Verify data transformation works correctly
4. Check error handling and fallbacks
5. Test rate limiting behavior

## Production Deployment

- Never expose API keys in client-side code
- Use environment variables (Vite prefixes with `VITE_`)
- Consider using a backend API gateway
- Implement proper error handling and retries
- Add caching to reduce API calls
