'use client'

import React from 'react'
import { m, AnimatePresence } from 'framer-motion'
import type { ConnectionStatus } from '@/hooks/useInventoryLiveUpdates'

interface LiveStatusBadgeProps {
  status: ConnectionStatus
  floating?: boolean
  className?: string
}

export default function LiveStatusBadge({
  status,
  floating = true,
  className = '',
}: LiveStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          label: 'Live Sync Active',
          textColor: 'text-emerald-300',
          dot: (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
            </span>
          ),
          hoverBorder: 'hover:border-emerald-500/40',
        }
      case 'connecting':
        return {
          label: 'Sync Reconnecting...',
          textColor: 'text-amber-300',
          dot: (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            </span>
          ),
          hoverBorder: 'hover:border-amber-500/40',
        }
      default:
        return {
          label: 'Polling Sync',
          textColor: 'text-white/50',
          dot: (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/40" />
            </span>
          ),
          hoverBorder: 'hover:border-white/30',
        }
    }
  }

  const { label, textColor, dot, hoverBorder } = getStatusConfig()

  if (floating) {
    return (
      <aside
        aria-label="Live sync status"
        className="fixed bottom-6 left-6 z-40 pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          <m.div
            key={status}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`group flex items-center bg-black/80 backdrop-blur-xl border border-white/15 ${hoverBorder} rounded-full shadow-2xl p-2.5 hover:px-3.5 hover:py-1.5 transition-all duration-300 ease-out cursor-pointer select-none ${className}`}
            title={`${label} (SSE Real-time connection)`}
          >
            {/* Pulsing Status Dot */}
            {dot}

            {/* Expandable Text on Hover */}
            <span
              className={`max-w-0 opacity-0 group-hover:max-w-[160px] group-hover:opacity-100 group-hover:ml-2.5 overflow-hidden transition-all duration-300 ease-out font-mono text-[11px] font-medium tracking-wide whitespace-nowrap ${textColor}`}
            >
              {label}
            </span>
          </m.div>
        </AnimatePresence>
      </aside>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-black/50 border border-white/15 backdrop-blur-md ${className}`}
    >
      {dot}
      <span className={`font-mono text-[11px] font-medium ${textColor}`}>{label}</span>
    </div>
  )
}
