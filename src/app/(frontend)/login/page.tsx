import React from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DarkVeil from '@/components/DarkVeil'

export const metadata = {
  title: 'Sign In | ROBOLUTION',
}

export default async function LoginPage() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  // If user is already authenticated, redirect them away from the login page
  if (user) {
    redirect('/profile')
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Fixed Background matches Home page */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 pt-20">
        {/* Glow effect matches Home page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-center mb-2 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40">
            Sign In
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-light text-center mb-8 max-w-sm mx-auto leading-relaxed">
            Welcome back to the dashboard
          </p>
          
          <LoginForm />
        </div>
      </section>
    </div>
  )
}
