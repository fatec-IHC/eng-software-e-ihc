import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Get base path for GitHub Pages
const basePath = process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true' 
  ? '/eng-software-e-ihc' 
  : '';

const logoPath = `${basePath}/logo.jpg`;

export const metadata: Metadata = {
  title: 'Sonho Doce - Sistema de Gestão',
  description: 'Sistema de ponto de venda e gestão para padarias',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: logoPath,
        media: '(prefers-color-scheme: light)',
      },
      {
        url: logoPath,
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: logoPath,
        type: 'image/jpg',
      },
    ],
    apple: logoPath,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
