# Private Wealth Management

A high-end React application for private wealth management, featuring portfolio analysis and proposal generation.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

### Build
Generate a production-ready build:
```bash
npm run build
```

## 📦 Deployment

This project is configured with **GitHub Actions** for automatic deployment to GitHub Pages.

- **Trigger**: Every push to the `main` branch.
- **Workflow**: `.github/workflows/deploy.yml`
- **Output**: Deployed to the `gh-pages` branch.

### Deployment Link
Once the GitHub Action completes, your site will be available at:
`https://firaen22.github.io/Private-Wealth-Management/`


> [!NOTE]
> The `base` path in `vite.config.ts` is set to `/Private-Wealth-Management/` to match the repository name. If you rename the repository, update this value.
- `App.tsx`: Main application entry and dashboard logic.
- `components/`: Modular React components.
- `index.html`: Base HTML template with Tailwind CDN and custom styles.
- `vite.config.ts`: Vite configuration with path aliases and environment variables.
