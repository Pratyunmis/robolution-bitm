import React from 'react'

export default function ItemDetailLoading() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="h-10 w-48 bg-white/10 rounded-full mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-black/50 border border-white/10 rounded-3xl p-6 space-y-6 animate-pulse">
              <div className="w-full aspect-square bg-white/10 rounded-2xl" />
              <div className="space-y-3">
                <div className="h-6 w-full bg-white/5 rounded" />
                <div className="h-6 w-full bg-white/5 rounded" />
                <div className="h-6 w-3/4 bg-white/5 rounded" />
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-3xl p-6 space-y-3 animate-pulse">
              <div className="h-12 w-full bg-white/15 rounded-2xl" />
              <div className="h-12 w-full bg-white/5 rounded-2xl" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3 animate-pulse">
              <div className="w-24 h-6 rounded-full bg-white/10" />
              <div className="w-80 h-10 rounded-xl bg-white/15" />
            </div>

            <div className="bg-black/50 border border-white/10 rounded-3xl p-8 space-y-6 animate-pulse">
              <div className="w-48 h-4 bg-white/10 rounded" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-white/5 rounded-2xl" />
                <div className="h-20 bg-white/5 rounded-2xl" />
                <div className="h-20 bg-white/5 rounded-2xl" />
              </div>
              <div className="w-full h-3 rounded-full bg-white/10" />
            </div>

            <div className="bg-black/50 border border-white/10 rounded-3xl p-8 space-y-4 animate-pulse">
              <div className="w-40 h-4 bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
              <div className="h-4 w-2/3 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
