'use client'

import { Analytics } from '@vercel/analytics/react'

export function AnalyticsWrapper() {
  // Only load Analytics when not on GitHub Pages
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true') {
    return null
  }
  
  return <Analytics />
}

