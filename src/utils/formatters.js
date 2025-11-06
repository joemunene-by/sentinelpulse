import { format, formatDistanceToNow, parseISO } from 'date-fns'

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString) => {
  try {
    const date = parseISO(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return 'Unknown'
  }
}

/**
 * Format date to readable string (e.g., "Jan 31, 2025")
 */
export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM d, yyyy')
  } catch (error) {
    return 'Unknown'
  }
}

/**
 * Format date and time (e.g., "Jan 31, 2025 at 1:22 PM")
 */
export const formatDateTime = (dateString) => {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM d, yyyy \'at\' h:mm a')
  } catch (error) {
    return 'Unknown'
  }
}

/**
 * Get severity color class
 */
export const getSeverityColor = (severity) => {
  const colors = {
    Low: 'text-green-400 bg-green-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/20',
    High: 'text-orange-400 bg-orange-400/20',
    Critical: 'text-danger bg-danger/20'
  }
  return colors[severity] || colors.Medium
}

/**
 * Get confidence level color
 */
export const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return 'text-accent-teal'
  if (confidence >= 60) return 'text-yellow-400'
  return 'text-orange-400'
}

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
