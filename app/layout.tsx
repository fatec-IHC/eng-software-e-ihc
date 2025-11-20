import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sonho Doce - Sistema de Gestão',
  description: 'Sistema de ponto de venda e gestão para padarias',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.jpg',
        type: 'image/jpg',
      },
    ],
    apple: '/logo.jpg',
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
        <Analytics />
      </body>
    </html>
  )
}
