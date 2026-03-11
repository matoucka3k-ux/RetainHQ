import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'RetainHQ — Gardez vos clients. Automatiquement.',
  description: 'RetainHQ envoie des sondages de satisfaction à vos clients et vous alerte quand l\'un d\'eux risque de partir.',
  metadataBase: new URL('https://retainhq.fr'),
  openGraph: {
    title: 'RetainHQ',
    description: 'Alertes satisfaction client automatiques pour agences et PME.',
    url: 'https://retainhq.fr',
    siteName: 'RetainHQ',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={font.variable}>
      <body className={`${font.className} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#f1f5f9',
              border: '1px solid #1e2d45',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
