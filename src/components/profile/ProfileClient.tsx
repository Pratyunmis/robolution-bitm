'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, LogOut, Package, UserCog, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthContext'

export const ProfileClient = ({ user: initialUser }: { user: any }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const { user: contextUser, setUser } = useAuth()
  // Use context user if available, fallback to initialUser
  const user = contextUser || initialUser

  // Edit form state
  const [isEditing, setIsEditing] = useState(false)
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [updateLoading, setUpdateLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    setMessage('')
    try {
      const payload: any = { email }
      if (password) payload.password = password

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update')
      
      // Update client context immediately
      setUser({ ...user, email })

      setMessage('Profile updated successfully!')
      setIsEditing(false)
      setPassword('')
      router.refresh()
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setUpdateLoading(false)
    }
  }

  const showInventory = ['intern', 'member', 'admin'].includes(user?.role)
  const showAdminDashboard = ['member', 'admin'].includes(user?.role)

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <UserCog className="w-6 h-6 text-sky-400" />
              My Profile
            </h2>
            <p className="text-zinc-400 text-sm mt-1 mb-0">Manage your account details and access</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Sign Out
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium mb-6 ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/10'}`}>
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-300">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={updateLoading}
                className="flex items-center justify-center min-w-[140px] px-6 py-3 bg-white text-black hover:bg-gray-100 font-semibold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
              >
                {updateLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setEmail(user?.email)
                  setPassword('')
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-sm font-medium">Email Address</span>
              <span className="text-white text-lg">{user?.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-sm font-medium">Access Role</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/5 text-zinc-300 text-sm font-bold uppercase tracking-wider">
                  {user?.role || 'Visitor'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 w-max px-6 py-2 border border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {showAdminDashboard && (
        <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-black/60 border border-cyan-500/30 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-cyan-950/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold">
                {user?.role === 'admin' ? 'Root Admin Console' : 'Member Workspace'}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              Robolution Admin Center
            </h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-md">
              Access the administrative CMS dashboard to manage team rosters, events, gallery releases, inventory catalog, and club announcements.
            </p>
          </div>
          <Link
            href="/admin"
            className="relative z-10 inline-flex items-center justify-center whitespace-nowrap px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-base rounded-full hover:brightness-110 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25"
          >
            Launch Dashboard
          </Link>
        </div>
      )}

      {showInventory && (
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-xl shadow-sky-900/5">
          <div>
            <h3 className="text-xl font-bold text-sky-400 uppercase tracking-wide flex items-center gap-2 mb-1">
              <Package className="w-6 h-6" />
              Lab Inventory Dashboard
            </h3>
            <p className="text-zinc-400 text-sm">
              Manage equipment checkouts, check returns, and view the lab catalog.
            </p>
          </div>
          <Link
            href="/inventory"
            className="hidden sm:inline-flex items-center justify-center whitespace-nowrap px-8 py-4 bg-white text-black font-semibold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30"
          >
            Open Dashboard
          </Link>
        </div>
      )}
      
      {showInventory && (
        <Link
          href="/inventory"
          className="sm:hidden flex w-full items-center justify-center whitespace-nowrap py-4 bg-white text-black font-semibold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 active:scale-95 shadow-lg shadow-white/20"
        >
          Open Dashboard
        </Link>
      )}
    </div>
  )
}
