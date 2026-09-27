'use client'

import React from 'react'
import { m } from 'framer-motion'
import { Layers, Zap, AlertTriangle } from 'lucide-react'
import type { DetailedInventoryItemDTO } from '@/types/inventory'

interface ItemStockMeterProps {
  item: DetailedInventoryItemDTO
  availabilityPct: number
  isOutOfStock: boolean
  isLowStock: boolean
}

export function ItemStockMeter({
  item,
  availabilityPct,
  isOutOfStock,
  isLowStock,
}: ItemStockMeterProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-black/50 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Live Stock Status
        </h3>
        <span
          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
            isOutOfStock
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : isLowStock
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {availabilityPct}% In Lab
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOutOfStock
              ? 'bg-rose-500'
              : isLowStock
                ? 'bg-amber-500'
                : 'bg-emerald-400'
          }`}
          style={{ width: `${Math.max(availabilityPct, 0)}%` }}
        />
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 pt-2">
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
          <span className="text-xs text-emerald-400 flex items-center gap-1 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Available
          </span>
          <span className="text-2xl md:text-3xl font-black text-white">
            {item.quantityAvailable}
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
          <span className="text-xs text-sky-400 flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-sky-400" />
            In Use
          </span>
          <span className="text-2xl md:text-3xl font-black text-white">
            {item.quantityIssued}
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
          <span className="text-xs text-white/50 flex items-center gap-1 mb-1">
            <Layers className="w-3 h-3 text-white/40" />
            Total Units
          </span>
          <span className="text-2xl md:text-3xl font-black text-white">
            {item.quantityTotal}
          </span>
        </div>
      </div>

      {/* Minimum Threshold Warning Note */}
      {isLowStock && (
        <div className="flex items-center gap-2 text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Stock has dropped to or below the minimum threshold ({item.minimumStock} units).
            Consider ordering replenishment soon.
          </span>
        </div>
      )}
    </m.div>
  )
}
