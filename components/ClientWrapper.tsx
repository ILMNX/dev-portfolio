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
      {isPreloaderVisible && (
        <Preloader onLoadComplete={() => setIsPreloaderVisible(false)} />
      )}
      {!isPreloaderVisible && children}
    </>
  )
}