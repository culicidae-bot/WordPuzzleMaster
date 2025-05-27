# WordPuzzleMaster

A word puzzle game with multiplayer functionality.

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/WordPuzzleMaster.git
   cd WordPuzzleMaster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Using GitHub Codespaces (Cloud Development)

1. Click on the "Code" button in your GitHub repository
2. Select the "Codespaces" tab
3. Click "Create codespace on main"
4. Once the codespace is ready, run:
   ```bash
   npm run dev
   ```
5. Click on the "Ports" tab and open the forwarded port (usually 3000 or 5173)

## Deployment Options

### 1. GitHub Pages (Frontend) + Render (Backend)

The project is configured to automatically deploy to GitHub Pages when you push to the main branch.

For the backend:
1. Create an account on [Render](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository
4. Use the following settings:
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Environment Variables: Set `NODE_ENV=production`

### 1.5. Netlify Functions (Serverless Backend)

The project includes Netlify Functions that can serve as a serverless backend:

1. The functions are located in the `netlify/functions` directory
2. They're automatically deployed when you deploy to Netlify
3. You can test them locally with:
   ```bash
   npm run netlify:dev
   ```
4. You can also test individual functions with:
   ```bash
   npm run netlify:test
   ```

### 2. Vercel (Full-Stack)

1. Create an account on [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Vercel will automatically detect the configuration in `vercel.json`
4. Click "Deploy"

### 3. Railway (Full-Stack)

1. Create an account on [Railway](https://railway.app/)
2. Create a new project and import your GitHub repository
3. Railway will use the configuration in `railway.json`
4. Add any required environment variables
5. Deploy

## Database Setup

The application uses PostgreSQL. For local development:

1. Install PostgreSQL or use a Docker container
2. Create a database for the application
3. Update the connection string in your environment variables

For production:
- Render, Railway, and Vercel all offer PostgreSQL database services
- [Neon](https://neon.tech/) is a good serverless PostgreSQL option

## GitHub Actions Workflow

The project includes a GitHub Actions workflow that:
1. Builds and tests the application
2. Deploys preview environments for pull requests (using Netlify)
3. Deploys to GitHub Pages for the main branch

To use Netlify for preview deployments:
1. Create a Netlify account and site
2. Add the following secrets to your GitHub repository:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: Your Netlify site ID

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request