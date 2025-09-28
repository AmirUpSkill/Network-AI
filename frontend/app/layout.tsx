import { Header } from '@/components/layout/Header'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Network AI',
  description: 'AI-powered LinkedIn networking for job seekers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}