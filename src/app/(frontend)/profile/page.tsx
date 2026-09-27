import React from 'react'
import { ProfileClient } from '@/components/profile/ProfileClient'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DarkVeil from '@/components/DarkVeil'

export const metadata = {
  title: 'My Profile | ROBOLUTION',
}

export default async function ProfilePage() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden border-y border-white/5">
      {/* Fixed Background matches Home page */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-32 pb-20">
        {/* Deep background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-2xl relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40">
              Dashboard
            </h1>
            <p className="text-lg md:text-xl text-white/50 font-light max-w-lg mx-auto leading-relaxed">
              Welcome back! Here's an overview of your profile and access inside the ROBOLUTION ecosystem.
            </p>
          </div>

          <ProfileClient user={JSON.parse(JSON.stringify(user))} />
        </div>
      </section>
    </div>
  )
}
