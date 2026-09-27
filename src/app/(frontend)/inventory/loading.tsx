import React from 'react'

export default function InventoryLoading() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center py-12 md:py-16 space-y-4">
          <div className="w-48 h-8 rounded-full bg-white/10 mx-auto animate-pulse" />
          <div className="w-80 h-16 rounded-2xl bg-white/10 mx-auto animate-pulse" />
          <div className="w-96 h-6 rounded-lg bg-white/5 mx-auto animate-pulse" />
        </div>

        {/* 4 Stats Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-14">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-3 animate-pulse"
            >
              <div className="w-24 h-4 rounded bg-white/10" />
              <div className="w-16 h-8 rounded-lg bg-white/15" />
              <div className="w-28 h-3 rounded bg-white/5" />
            </div>
          ))}
        </div>

        {/* Toolbar Skeleton */}
        <div className="h-16 bg-white/5 border border-white/10 rounded-3xl mb-10 animate-pulse" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="w-20 h-5 rounded-full bg-white/10" />
                <div className="w-16 h-5 rounded-full bg-white/10" />
              </div>
              <div className="w-3/4 h-6 rounded-lg bg-white/15" />
              <div className="w-1/2 h-4 rounded bg-white/5" />
              <div className="w-full h-2 rounded-full bg-white/10 mt-6" />
              <div className="w-full h-10 rounded-2xl bg-white/10 mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
