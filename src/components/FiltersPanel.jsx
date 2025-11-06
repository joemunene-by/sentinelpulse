import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiSearch } from 'react-icons/fi'

const FILTER_OPTIONS = {
  timeRange: ['1h', '24h', '7d', '30d'],
  severities: ['Low', 'Medium', 'High', 'Critical'],
  regions: ['Global', 'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'],
  tags: ['ransomware', 'zero-day', 'phishing', 'malware', 'breach', 'ddos', 'apt', 'cloud', 'iot', 'supply-chain', 'ai', 'social-engineering'],
  sectors: ['Healthcare', 'Financial Services', 'Government', 'Technology', 'Critical Infrastructure', 'Defense', 'Non-Profit']
}

const FiltersPanel = ({ filters, onFiltersChange }) => {
  const [searchText, setSearchText] = useState(filters.searchText || '')
  const [reducedMotion] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const handleTimeRangeChange = (range) => {
    onFiltersChange({ ...filters, timeRange: range })
  }

  const toggleSeverity = (severity) => {
    const severities = filters.severities || []
    const newSeverities = severities.includes(severity)
      ? severities.filter(s => s !== severity)
      : [...severities, severity]
    onFiltersChange({ ...filters, severities: newSeverities })
  }

  const toggleRegion = (region) => {
    const regions = filters.regions || []
    const newRegions = regions.includes(region)
      ? regions.filter(r => r !== region)
      : [...regions, region]
    onFiltersChange({ ...filters, regions: newRegions })
  }

  const toggleTag = (tag) => {
    const tags = filters.tags || []
    const newTags = tags.includes(tag)
      ? tags.filter(t => t !== tag)
      : [...tags, tag]
    onFiltersChange({ ...filters, tags: newTags })
  }

  const handleSearchChange = (value) => {
    setSearchText(value)
    onFiltersChange({ ...filters, searchText: value })
  }

  const clearFilters = () => {
    setSearchText('')
    onFiltersChange({
      timeRange: '24h',
      severities: [],
      regions: [],
      tags: [],
      searchText: ''
    })
  }

  const hasActiveFilters = 
    (filters.severities?.length > 0) ||
    (filters.regions?.length > 0) ||
    (filters.tags?.length > 0) ||
    (filters.searchText?.trim().length > 0)

  return (
    <aside className="w-full lg:w-64 bg-surface rounded-lg p-6 border border-surface/50 h-fit lg:sticky lg:top-20" aria-label="Filters">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-heading font-semibold text-white">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-accent-teal transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal rounded"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search titles, content..."
              className="w-full pl-10 pr-4 py-2 bg-base border border-surface/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent"
              aria-label="Search news and incidents"
            />
            {searchText && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
          <div className="space-y-2">
            {FILTER_OPTIONS.timeRange.map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal ${
                  filters.timeRange === range
                    ? 'bg-accent-violet/20 text-accent-violet border border-accent-violet/50'
                    : 'bg-base text-gray-300 hover:bg-surface border border-surface/50'
                }`}
                aria-pressed={filters.timeRange === range}
              >
                Last {range === '1h' ? '1 hour' : range === '24h' ? '24 hours' : range === '7d' ? '7 days' : '30 days'}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.severities.map((severity) => {
              const isSelected = filters.severities?.includes(severity)
              return (
                <button
                  key={severity}
                  onClick={() => toggleSeverity(severity)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal ${
                    isSelected
                      ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/50'
                      : 'bg-base text-gray-400 border border-surface/50 hover:border-accent-teal/50'
                  }`}
                  aria-pressed={isSelected}
                >
                  {severity}
                </button>
              )
            })}
          </div>
        </div>

        {/* Regions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Regions</label>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.regions.map((region) => {
              const isSelected = filters.regions?.includes(region)
              return (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal ${
                    isSelected
                      ? 'bg-accent-violet/20 text-accent-violet border border-accent-violet/50'
                      : 'bg-base text-gray-400 border border-surface/50 hover:border-accent-violet/50'
                  }`}
                  aria-pressed={isSelected}
                >
                  {region}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.tags.map((tag) => {
              const isSelected = filters.tags?.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal ${
                    isSelected
                      ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/50'
                      : 'bg-base text-gray-400 border border-surface/50 hover:border-accent-teal/50'
                  }`}
                  aria-pressed={isSelected}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default FiltersPanel
