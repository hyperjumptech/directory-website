import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { contentsForLanguage } from '@/lib/contents'
import Footer from '@/components/footer'
import Script from 'next/script'
import { GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const contents = await contentsForLanguage('en')

  return {
    title: contents['metadataTitle'],
    description: contents['metadataDescription'],
    keywords: contents['metadataKeywords'],
    metadataBase: new URL('https://vibecoding.hyperjump.tech'),
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://kit.fontawesome.com/f6999a3218.js" />
      <GoogleTagManager gtmId="GTM-P65K4LKC" />

      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Footer lang="en" />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
