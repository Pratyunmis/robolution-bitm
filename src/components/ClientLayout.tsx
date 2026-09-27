'use client'

import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/providers/AuthContext'
import type { User } from '@/payload-types'
import { RobotCollisionLoader } from '@/components/layout/RobotCollisionLoader'

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
  )
}
