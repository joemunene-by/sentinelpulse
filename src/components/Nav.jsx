import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'

const Nav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
    { id: 'feed', label: 'Feed', href: '#feed' },
    { id: 'incidents', label: 'Incidents', href: '#incidents' },
    { id: 'research', label: 'Research', href: '#research' },
    { id: 'about', label: 'About', href: '#about' }
  ]

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-base/95 backdrop-blur-md border-b border-surface" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-teal rounded flex items-center justify-center">
              <span className="text-base font-bold text-base">S</span>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-white">SentinelPulse</h1>
              <p className="text-xs text-gray-400">Built by CEO Joe Munene</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-accent-teal transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 focus:ring-offset-base"
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-accent-teal transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-teal"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-accent-teal transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent-teal"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="md:hidden border-t border-surface bg-base"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:text-accent-teal hover:bg-surface rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent-teal"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Nav
