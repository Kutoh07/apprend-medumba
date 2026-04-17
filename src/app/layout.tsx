import type { Metadata } from 'next'
import { Inter, Noto_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-sans',
})

export const metadata: Metadata = {
  title: 'Apprend-Medumba',
  description: 'Apprenez la langue Medumba — langue bantoue du Cameroun',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${notoSans.variable} font-sans bg-background text-foreground`}>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
          Apprend-Medumba &copy; 2026
        </footer>
      </body>
    </html>
  )
}
