# 👻 SentinelPulse

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Build-Vite-blue?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Styling-Tailwind-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

**Real-time Threat Intelligence Dashboard**

Built by CEO Joe Munene

SentinelPulse is an enterprise-grade cybersecurity threat intelligence dashboard designed for governments, NGOs, enterprises, and security teams. It provides real-time visibility into global cyber threats through a polished, dark-mode-first interface.

## Features

- 📊 **Real-time Threat Feed** - Aggregated cybersecurity news and incidents
- 🗺️ **Global Threat Heatmap** - Visual representation of incident density by region
- 📈 **Interactive Timeline** - Chronological view of security incidents
- 🔍 **Advanced Filtering** - Filter by time range, severity, region, tags, and keywords
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ♿ **Accessible** - WCAG-compliant with keyboard navigation and screen reader support
- 🎨 **Dark Mode** - Tactical control-room aesthetic with high contrast

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Window** - Virtualized lists for performance

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

The application will automatically open in your default browser.

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

Or connect your GitHub repository to Vercel for automatic deployments.

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run `netlify deploy` for a draft, or `netlify deploy --prod` for production
3. Follow the prompts

Or drag and drop the `dist/` folder to Netlify's dashboard.

### Other Platforms

Since this is a static site, you can deploy to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage
- Any CDN or web server

## Integrating Real APIs

Currently, the application uses mock data. To integrate real threat intelligence APIs:

1. Read the API integration guide: `src/api/README_API.md`
2. Set up API keys as environment variables (see below)
3. Update `src/utils/mockApi.js` to use real API calls
4. Handle CORS issues (use a backend proxy for production)

### Environment Variables

Create a `.env` file in the project root:

```env
# API Keys (replace with your actual keys)
VITE_NEWSAPI_KEY=your_newsapi_key_here
VITE_VIRUSTOTAL_KEY=your_virustotal_key_here
VITE_MISP_BASE_URL=https://your-misp-instance.com
VITE_MISP_API_KEY=your_misp_api_key
VITE_RECORDEDFUTURE_TOKEN=your_rf_token

# Feature flags
VITE_USE_REAL_API=false
```

**Important**: Never commit `.env` files to version control. Add `.env` to `.gitignore`.

## Project Structure

```
sentinelpulse/
├── public/              # Static assets
│   ├── index.html      # HTML template
│   ├── favicon.svg     # Favicon
│   └── manifest.json   # PWA manifest
├── src/
│   ├── components/     # React components
│   │   ├── Nav.jsx
│   │   ├── HeroSummary.jsx
│   │   ├── NewsFeed.jsx
│   │   ├── ThreatCard.jsx
│   │   ├── ArticleModal.jsx
│   │   ├── FiltersPanel.jsx
│   │   ├── MetricCounters.jsx
│   │   ├── IncidentTimeline.jsx
│   │   ├── HeatmapGlobe.jsx
│   │   └── Footer.jsx
│   ├── data/           # Mock data
│   │   ├── sampleNews.json
│   │   └── sampleIncidents.json
│   ├── api/            # API integration docs
│   │   └── README_API.md
│   ├── utils/          # Utility functions
│   │   ├── formatters.js
│   │   └── mockApi.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Customization

### Contact Information

Update contact details in:
- `src/components/Footer.jsx`
- `src/components/App.jsx` (About section)
- `public/index.html` (meta tags)

### Colors & Styling

Edit `tailwind.config.js` to customize the color palette and fonts.

### Mock Data

Modify `src/data/sampleNews.json` and `src/data/sampleIncidents.json` to add or change mock entries.

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion support
- High contrast colors

## Performance

- Virtualized lists for long feeds
- Lazy loading for heavy components
- Optimized bundle size with Vite
- Code splitting
- Image optimization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is proprietary and owned by CEO Joe Munene.

## Support

For questions or support:
- Email: joemunene984@gmail.com
- Phone: +254 718 733 968

## Disclaimer

This dashboard uses mock data for demonstration purposes. All threat intelligence data is fabricated and should not be used for real-world security decisions. When integrating real APIs, ensure proper data validation and security measures are in place.

---

**Built with ❤️ by CEO Joe Munene**
