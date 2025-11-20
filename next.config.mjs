/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true'

const nextConfig = {
  // Enable static export for GitHub Pages
  output: isGitHubPages ? 'export' : undefined,
  
  // Base path for GitHub Pages subdirectory
  basePath: isGitHubPages ? '/eng-software-e-ihc' : '',
  
  // Asset prefix for GitHub Pages
  assetPrefix: isGitHubPages ? '/eng-software-e-ihc' : '',
  
  // Images configuration
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for better GitHub Pages compatibility
  trailingSlash: isGitHubPages,
}

export default nextConfig
