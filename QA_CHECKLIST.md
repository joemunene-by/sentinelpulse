# QA / Testing Checklist

This checklist ensures the SentinelPulse project meets all acceptance criteria.

## ✅ Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Project dependencies installed (`npm install`)

## ✅ Project Setup

- [ ] Project runs with `npm install && npm run dev`
- [ ] No console errors on startup
- [ ] Application loads at `http://localhost:3000`
- [ ] All pages/sections are accessible

## ✅ Mock Data

- [ ] Mock feed shows ≥20 items
- [ ] Sample incidents show ≥20 items
- [ ] All data entries have required fields (id, title, source, published_at, severity, etc.)
- [ ] No real PII or sensitive data in mock entries

## ✅ Components Functionality

### Navigation
- [ ] Nav component renders with logo and CEO mention
- [ ] Anchor links scroll to correct sections
- [ ] Mobile hamburger menu works
- [ ] Reduced motion toggle works

### Hero Summary
- [ ] Global threat level displays correctly
- [ ] Pulsing animation works for High/Critical threats
- [ ] Top 3 headlines display
- [ ] Sparkline/trend graph renders
- [ ] Export Snapshot button works and downloads JSON

### Filters Panel
- [ ] Time range filter works (1h, 24h, 7d, 30d)
- [ ] Severity multi-select works
- [ ] Region filter works
- [ ] Tag chips work and filter correctly
- [ ] Search text filters titles and content
- [ ] Clear All button resets filters
- [ ] All filtering is client-side

### News Feed
- [ ] Feed displays filtered news items
- [ ] Each ThreatCard shows all required info
- [ ] Bookmark toggle works (persists to localStorage)
- [ ] Clicking a tag filters to that tag
- [ ] Clicking a card opens ArticleModal
- [ ] Empty state shows when no matches
- [ ] Loading state displays correctly

### Threat Card
- [ ] Displays source, title, time-ago, severity badge
- [ ] Confidence meter shows (0-100)
- [ ] Tags display and are clickable
- [ ] Bookmark icon toggles state
- [ ] Clicking opens modal

### Article Modal
- [ ] Opens when card is clicked
- [ ] Keyboard trappable (Tab, Escape)
- [ ] Displays full article content
- [ ] Shows indicators (IPs, URLs, hashes)
- [ ] Copy Indicators button works
- [ ] Export Report (JSON) button works
- [ ] Close button works
- [ ] Modal is aria-modal="true"

### Metric Counters
- [ ] Animated counters count up
- [ ] Shows incidents (24h)
- [ ] Shows average severity
- [ ] Shows top affected sector
- [ ] Shows flagged indicators count
- [ ] Attack types distribution chart renders
- [ ] Sector distribution chart renders
- [ ] Metrics update when filters change

### Incident Timeline
- [ ] Timeline displays incidents chronologically
- [ ] Timeline events grouped by date
- [ ] Clicking event scrolls to feed
- [ ] Timeline is interactive
- [ ] Empty state shows when no incidents

### Heatmap Globe
- [ ] Globe/map renders (SVG fallback)
- [ ] Shows incident density by country
- [ ] Hover shows country name and count
- [ ] Clicking country filters to region
- [ ] Legend displays correctly
- [ ] WebGL check works (fallback to SVG)

### Footer
- [ ] About section mentions CEO Joe Munene
- [ ] Contact email: joemunene984@gmail.com
- [ ] Contact phone: +254 718 733 968
- [ ] Security.txt link works
- [ ] All links are functional

## ✅ Styling & Design

- [ ] Dark mode theme applied (base: #071226)
- [ ] Accent colors correct (teal: #00E6C3, violet: #7A4DFF)
- [ ] Typography uses Space Grotesk for headings, Inter for body
- [ ] IBM Plex Mono for monospace
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] 12-column grid layout on desktop
- [ ] Left rail filters, center feed, right rail metrics
- [ ] Mobile stacks vertically

## ✅ Accessibility

- [ ] Semantic HTML used throughout
- [ ] ARIA labels on interactive elements
- [ ] aria-live regions for dynamic content
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Reduced motion respected (prefers-reduced-motion)
- [ ] Focus indicators visible
- [ ] Screen reader compatible

## ✅ Performance

- [ ] No console warnings/errors
- [ ] List rendering is performant (even with 20+ items)
- [ ] Animations are smooth (when not reduced motion)
- [ ] Images/assets load quickly
- [ ] Bundle size is reasonable

## ✅ API Integration

- [ ] `src/api/README_API.md` exists with integration instructions
- [ ] `src/utils/mockApi.js` exports fetchNews and fetchIncidents
- [ ] Mock API simulates async behavior (Promise.resolve)
- [ ] Filtering logic works correctly
- [ ] Instructions for NewsAPI integration provided
- [ ] Instructions for VirusTotal integration provided
- [ ] Instructions for MISP integration provided
- [ ] Instructions for Recorded Future integration provided
- [ ] CORS proxy notes included

## ✅ Export Functionality

- [ ] Export Snapshot button downloads JSON
- [ ] Snapshot includes filters and data
- [ ] Export Report in modal downloads JSON
- [ ] JSON files are properly formatted
- [ ] Filenames include timestamps

## ✅ SEO & Meta

- [ ] `public/index.html` has proper title
- [ ] Open Graph tags present
- [ ] Twitter card tags present
- [ ] JSON-LD for Organization present
- [ ] CEO Joe Munene mentioned in meta

## ✅ Documentation

- [ ] README.md exists with setup instructions
- [ ] README explains how to run locally
- [ ] README explains build process
- [ ] README explains deployment (Vercel/Netlify)
- [ ] README explains API integration
- [ ] Project structure documented

## ✅ Code Quality

- [ ] No linting errors
- [ ] Components are clean and commented
- [ ] Functional React components (hooks)
- [ ] Tailwind CSS used for styling
- [ ] No hardcoded sensitive data
- [ ] Clear comments for API replacement points

## ✅ Browser Compatibility

- [ ] Works in Chrome/Edge (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Safari (latest)
- [ ] Works on mobile browsers

## ✅ Edge Cases

- [ ] Empty feed handled gracefully
- [ ] No matches for filters handled
- [ ] Missing data fields handled
- [ ] Modal closes on backdrop click
- [ ] Modal closes on Escape key
- [ ] Filters persist during navigation

---

## Testing Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Note**: Mark each item as complete after testing. All items should be checked before considering the project complete.
