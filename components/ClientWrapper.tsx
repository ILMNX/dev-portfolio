'use client'

import { useState } from 'react'
import Preloader from './Preloader'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true)

  return (
    <>
      {/* Children always render — no blocking */}
      {children}
      {/* Preloader sits on top as a fixed overlay */}
      {isPreloaderVisible && (
        <Preloader onLoadComplete={() => setIsPreloaderVisible(false)} />
      )}
    </>
  )
}