'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export function ClientLayout({ 
  children,
  user,
}: { 
  children: React.ReactNode
  user?: any
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
