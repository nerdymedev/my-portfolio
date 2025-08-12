import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio - Abdulkareem .O',
  description: 'A modern portfolio showcasing innovative projects and coding expertise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className={`${inter.className} bg-background dark:bg-background-dark text-text-primary dark:text-text-primary-dark transition-colors duration-300`}>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </body>
      </ThemeProvider>
    </html>
  )
}