import React from 'react'

export default function TransactionsLoading() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-44 bg-white/10 rounded-full mb-8 animate-pulse" />
        <div className="h-12 w-72 bg-white/15 rounded-xl mb-6 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
