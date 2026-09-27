'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { m } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Cpu,
  Zap,
  RotateCcw,
  PlusCircle,
  ShieldAlert,
  Barcode,
  Copy,
  Check,
  MapPin,
  Boxes,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import type { DetailedInventoryItemDTO, UserRole } from '@/types/inventory'

interface ItemHeaderProps {
  item: DetailedInventoryItemDTO
  isOutOfStock: boolean
  isLowStock: boolean
  currentUserRole?: UserRole
  onOpenDialog: (type: 'issue' | 'return' | 'restock' | 'damage') => void
}

export function ItemHeader({
  item,
  isOutOfStock,
  isLowStock,
  currentUserRole,
  onOpenDialog,
}: ItemHeaderProps) {
  const [copiedSku, setCopiedSku] = useState(false)

  const copySku = () => {
    if (item.sku) {
      navigator.clipboard.writeText(item.sku)
      setCopiedSku(true)
      setTimeout(() => setCopiedSku(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Visual Card */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />

        {/* Image or Category Fallback */}
        <div className="w-full aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative mb-6">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/30 gap-3">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <Cpu className="w-16 h-16 text-white/40" />
              </div>
              <span className="text-xs uppercase tracking-widest text-white/40">
                {item.category.name}
              </span>
            </div>
          )}

          {/* Status Badge in Photo Corner */}
          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-500/80 text-white backdrop-blur-md shadow-lg">
                <AlertCircle className="w-3.5 h-3.5" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/80 text-white backdrop-blur-md shadow-lg">
                <AlertTriangle className="w-3.5 h-3.5" />
                Low Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/80 text-white backdrop-blur-md shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available
              </span>
            )}
          </div>
        </div>

        {/* Quick Specs metadata list */}
        <div className="space-y-3 text-sm">
          {item.sku && (
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-white/50 flex items-center gap-1.5">
                <Barcode className="w-4 h-4" /> SKU Tracking
              </span>
              <button
                onClick={copySku}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-white/90 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 transition-colors"
                title="Click to copy SKU"
              >
                <span>{item.sku}</span>
                {copiedSku ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/40" />
                )}
              </button>
            </div>
          )}

          {item.location && (
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-white/50 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Lab Location
              </span>
              <span className="font-semibold text-white/90 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                {item.location}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/50 flex items-center gap-1.5">
              <Boxes className="w-4 h-4" /> Category
            </span>
            <span className="text-white/90 font-medium">{item.category.name}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-white/50 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Min Threshold
            </span>
            <span className="text-white/80 font-mono">{item.minimumStock} units</span>
          </div>
        </div>
      </m.div>

      {/* Actions Panel */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-2">
          Quick Actions
        </h3>

        <Button
          onClick={() => onOpenDialog('issue')}
          disabled={isOutOfStock}
          className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{currentUserRole === 'intern' ? 'Request Checkout' : 'Checkout Component'}</span>
        </Button>

        <Button
          onClick={() => onOpenDialog('return')}
          disabled={item.quantityIssued <= 0}
          variant="outline"
          className="w-full bg-white/5 hover:bg-white/10 border-white/15 text-emerald-400 hover:text-emerald-300 font-medium py-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Return Component ({item.quantityIssued} in use)</span>
        </Button>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => onOpenDialog('restock')}
            variant="outline"
            className="bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white text-xs py-5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Restock Units</span>
          </Button>

          <Button
            onClick={() => onOpenDialog('damage')}
            variant="outline"
            disabled={item.quantityAvailable <= 0}
            className="bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 border-white/10 text-white/60 hover:text-rose-300 text-xs py-5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Damaged</span>
          </Button>
        </div>
      </m.div>
    </div>
  )
}
