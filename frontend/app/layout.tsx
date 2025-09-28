import { Header } from '@/components/layout/Header'
import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/providers/theme-provider"

export const metadata: Metadata = {
  title: 'Network AI',
  description: 'AI-powered LinkedIn networking for job seekers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}