'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/providers/AuthContext'

export function ClientLayout({ 
  children,
  user,
}: { 
  children: React.ReactNode
  user?: any
}) {
  return (
    <AuthProvider initialUser={user}>
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
  )
}
