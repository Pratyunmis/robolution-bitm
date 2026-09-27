'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/providers/AuthContext'
import type { User } from '@/payload-types'

export function ClientLayout({ 
  children,
  user,
}: { 
  children: React.ReactNode
  user?: User | null
}) {
  return (
    <AuthProvider initialUser={user}>
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
  )
}
