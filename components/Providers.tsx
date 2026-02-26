'use client'

import { ThemeProvider } from 'next-themes'
import { DarkLightMode } from '@/components/DarkLightMode'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <div className="fixed top-4 right-4 z-50">
        <DarkLightMode />
      </div>
    </ThemeProvider>
  )
}
