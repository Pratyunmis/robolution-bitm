'use client'

import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/providers/AuthContext'
import type { User } from '@/payload-types'
import { RobotCollisionLoader } from '@/components/layout/RobotCollisionLoader'

<<<<<<< Updated upstream
export function ClientLayout({ 
  children,
  user,
}: { 
  children: React.ReactNode
  user?: User | null
}) {
  return (
    <AuthProvider initialUser={user}>
      <RobotCollisionLoader />
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
=======
const LoadingScreen = lazy(() => import('@/components/LoadingScreen'))

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // Only show loading screen on first visit per session
  useEffect(() => {
    const seen = sessionStorage.getItem('robolution-loaded')
    if (seen) {
      setLoading(false)
      setShowContent(true)
    } else {
      setShowContent(true) // mount content behind loader
    }
  }, [])

  const handleLoadingComplete = () => {
    sessionStorage.setItem('robolution-loaded', '1')
    setLoading(false)
  }

  return (
    <>
      {/* Loading screen — lazy loaded, shown only on first visit */}
      {loading && (
        <Suspense fallback={null}>
          <LoadingScreen onComplete={handleLoadingComplete} />
        </Suspense>
      )}

      {/* Site content — always mounted, hidden behind loader */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <Navbar />
        {showContent && children}
        <Footer />
      </div>
    </>
>>>>>>> Stashed changes
  )
}
