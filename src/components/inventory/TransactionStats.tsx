'use client'

import React from 'react'

interface TransactionStatsProps {
  totalLogs: number
  checkouts: number
  returns: number
  restocked: number
}

export function TransactionStats({
  totalLogs,
  checkouts,
  returns,
  restocked,
}: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
        <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">
          Total Logs
        </span>
        <span className="text-2xl sm:text-3xl font-black text-white">{totalLogs}</span>
      </div>

      <div className="bg-sky-500/10 border border-sky-500/20 p-5 rounded-2xl backdrop-blur-md">
        <span className="text-xs text-sky-400/80 uppercase tracking-wider block mb-1">
          Units Issued
        </span>
        <span className="text-2xl sm:text-3xl font-black text-sky-400">{checkouts}</span>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-md">
        <span className="text-xs text-emerald-400/80 uppercase tracking-wider block mb-1">
          Units Returned
        </span>
        <span className="text-2xl sm:text-3xl font-black text-emerald-400">{returns}</span>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl backdrop-blur-md">
        <span className="text-xs text-indigo-400/80 uppercase tracking-wider block mb-1">
          Units Restocked
        </span>
        <span className="text-2xl sm:text-3xl font-black text-indigo-400">{restocked}</span>
      </div>
    </div>
  )
}
