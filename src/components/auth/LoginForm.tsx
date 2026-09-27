'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthContext'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign in. Please check your credentials.')
      }

      // Automatically update client-side auth context to update Navbar instantly
      setUser(data.user)

      // Success, refresh the router to update server components (like layout)
      router.refresh()
      router.push('/profile')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md flex flex-col gap-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/10 text-red-500 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="email">Email</label>
        <input 
          id="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-sans"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="password">Password</label>
        <input 
          id="password"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-sans"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-white text-black font-semibold text-lg py-4 px-6 rounded-full hover:bg-zinc-200 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 disabled:opacity-50 disabled:hover:scale-100 tracking-wide"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin text-zinc-500" /> : 'Sign In'}
      </button>
    </form>
  )
}
