/**
 * Get the base path for GitHub Pages
 * Returns '/eng-software-e-ihc' when on GitHub Pages, empty string otherwise
 */
export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    // Client-side: check if we're on GitHub Pages
    return process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true' ? '/eng-software-e-ihc' : '';
  }
  // Server-side: check environment variable
  return process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true' 
    ? '/eng-software-e-ihc' 
    : '';
}

/**
 * Get a path with the correct basePath prefix
 * Use this for static assets like images
 */
export function getAssetPath(path: string): string {
  const basePath = getBasePath();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

