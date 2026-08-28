'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type AuthContextType = {
  user: any
  setUser: (user: any) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
})

export const AuthProvider = ({ children, initialUser }: { children: React.ReactNode, initialUser: any }) => {
  const [user, setUser] = useState(initialUser)

  // Sync if server component provides a new initialUser (e.g. after router.refresh)
  useEffect(() => {
    setUser(initialUser)
  }, [initialUser])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
