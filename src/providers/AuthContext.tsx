'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@/payload-types'

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
})

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser?: User | null
}) => {
  const [user, setUser] = useState<User | null>(initialUser ?? null)

  // Sync if server component provides a new initialUser (e.g. after router.refresh)
  useEffect(() => {
    setUser(initialUser ?? null)
  }, [initialUser])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
