'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { m } from 'framer-motion'
import DarkVeil from '@/components/DarkVeil'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  MapPin,
  Barcode,
  Copy,
  Check,
  Cpu,
  Layers,
  Zap,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  User as UserIcon,
  ShieldAlert,
  PlusCircle,
  FileText,
  RotateCcw,
  Boxes,
} from 'lucide-react'

export interface DetailedInventoryItem {
  id: string
  name: string
  sku?: string
  category: {
    id: string
    name: string
  }
  imageUrl?: string
  location?: string
  quantityTotal: number
  quantityAvailable: number
  quantityIssued: number
  minimumStock: number
  status: 'active' | 'out-of-stock' | 'discontinued'
  updatedAt: string
  createdAt: string
}

export interface TransformedTransaction {
  id: string
  type: 'issue' | 'return' | 'restock' | 'adjust' | 'damage'
  quantity: number
  reason?: string
  timestamp: string
  performedBy?: {
    id: string
    email: string
  }
  issuedTo?: {
    id: string
    email: string
  }
}

interface ItemDetailClientProps {
  item: DetailedInventoryItem
  transactions: TransformedTransaction[]
  descriptionHtml: string
}

export default function ItemDetailClient({
  item,
  transactions,
  descriptionHtml,
}: ItemDetailClientProps) {
  const [copiedSku, setCopiedSku] = useState(false)

  const copySku = () => {
    if (item.sku) {
      navigator.clipboard.writeText(item.sku)
      setCopiedSku(true)
      setTimeout(() => setCopiedSku(false), 2000)
    }
  }

  const availabilityPct =
    item.quantityTotal > 0
      ? Math.round((item.quantityAvailable / item.quantityTotal) * 100)
      : 0
  const isOutOfStock = item.quantityAvailable === 0
  const isLowStock = !isOutOfStock && item.quantityAvailable <= item.minimumStock

  const getTransactionBadge = (type: TransformedTransaction['type']) => {
    switch (type) {
      case 'issue':
        return {
          label: 'Checkout',
          icon: Zap,
          color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        }
      case 'return':
        return {
          label: 'Return',
          icon: RotateCcw,
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        }
      case 'restock':
        return {
          label: 'Restock',
          icon: PlusCircle,
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        }
      case 'damage':
        return {
          label: 'Damage Write-off',
          icon: ShieldAlert,
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        }
      case 'adjust':
        return {
          label: 'Count Adjustment',
          icon: Layers,
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        }
    }
  }

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (_e) {
      return isoString
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden pt-24 pb-32">
      {/* Fixed WebGL Shader Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-white/10 mb-8">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </Link>

          <div className="flex items-center gap-2 text-xs md:text-sm text-white/40 font-mono">
            <span>Inventory</span>
            <span>/</span>
            <span className="text-white/60">{item.category.name}</span>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[200px]">{item.name}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image, Quick Specs & Quick Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
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

              <Link href={`/admin/collections/inventory-transactions/create`} className="block">
                <Button
                  disabled={isOutOfStock}
                  className="w-full rounded-2xl py-6 font-bold text-base bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>{isOutOfStock ? 'Item Out of Stock' : 'Request Checkout'}</span>
                </Button>
              </Link>

              {item.quantityIssued > 0 && (
                <Link href={`/admin/collections/inventory-transactions/create`} className="block">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl py-6 font-semibold text-sm bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Return Checkouts ({item.quantityIssued} in use)</span>
                  </Button>
                </Link>
              )}

              <div className="pt-2">
                <Link
                  href={`/admin/collections/inventory-items/${item.id}`}
                  className="text-xs text-center block text-white/40 hover:text-white/80 transition-colors underline underline-offset-4"
                >
                  Edit item in Admin Panel →
                </Link>
              </div>
            </m.div>
          </div>

          {/* Right Column: Live Stock Breakdown, Specs, and Movement History (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Title & Headline Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs uppercase tracking-widest text-white/50 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full font-medium">
                  {item.category.name}
                </span>
                {item.sku && (
                  <span className="text-xs font-mono text-white/40 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    {item.sku}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                {item.name}
              </h1>
            </div>

            {/* Live Stock Breakdown Metric Box */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden"
            >
              <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4 text-white/70" />
                Live Stock Availability
              </h3>

              {/* 3 Metric Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-1 font-medium">Total Owned</div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{item.quantityTotal}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">units</div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                  <div className="text-xs text-emerald-400/80 uppercase tracking-wider mb-1 font-medium">In Lab</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">{item.quantityAvailable}</div>
                  <div className="text-[10px] text-emerald-400/60 mt-0.5">available</div>
                </div>

                <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4">
                  <div className="text-xs text-sky-400/80 uppercase tracking-wider mb-1 font-medium">Issued</div>
                  <div className="text-2xl sm:text-3xl font-black text-sky-400">{item.quantityIssued}</div>
                  <div className="text-[10px] text-sky-400/60 mt-0.5">in projects</div>
                </div>
              </div>

              {/* Stock Bar Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Lab Availability Ratio</span>
                  <span className="font-bold text-white">{availabilityPct}% Available</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isOutOfStock
                        ? 'bg-rose-500'
                        : isLowStock
                          ? 'bg-amber-500'
                          : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.max(availabilityPct, 0)}%` }}
                  />
                </div>
              </div>

              {/* Low Stock Warning Callout */}
              {isLowStock && (
                <div className="mt-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-200 text-xs sm:text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-amber-300 mb-0.5">Low Stock Warning</strong>
                    Only {item.quantityAvailable} units remain in the lab, which is at or below the minimum threshold ({item.minimumStock} units).
                  </div>
                </div>
              )}

              {isOutOfStock && (
                <div className="mt-6 flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-200 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-rose-300 mb-0.5">Component Out of Stock</strong>
                    All {item.quantityTotal} units are currently issued or unavailable. Checkouts are temporarily disabled.
                  </div>
                </div>
              )}
            </m.div>

            {/* Description & Technical Specifications */}
            {descriptionHtml && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
              >
                <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white/70" />
                  Specifications &amp; Details
                </h3>
                <div
                  className="prose prose-invert max-w-none text-white/70 leading-relaxed text-sm md:text-base prose-headings:text-white prose-a:text-white prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </m.div>
            )}

            {/* Transaction Movement History Timeline */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/70" />
                  Item Movement History
                </h3>
                <span className="text-xs text-white/40 font-mono">
                  {transactions.length} record{transactions.length === 1 ? '' : 's'}
                </span>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white/5 rounded-2xl border border-white/5">
                  <Clock className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-sm text-white/50 font-medium">No recorded movements yet</p>
                  <p className="text-xs text-white/30 mt-1">
                    Transactions like checkouts, returns, and restocks will appear here in chronological order.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => {
                    const badge = getTransactionBadge(tx.type)
                    const Icon = badge.icon

                    return (
                      <div
                        key={tx.id}
                        className="bg-white/5 border border-white/5 hover:border-white/15 rounded-2xl p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className={`p-2 rounded-xl border ${badge.color} shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">
                                {tx.type === 'issue'
                                  ? `Checked out ${tx.quantity} unit${tx.quantity === 1 ? '' : 's'}`
                                  : tx.type === 'return'
                                    ? `Returned ${tx.quantity} unit${tx.quantity === 1 ? '' : 's'}`
                                    : tx.type === 'restock'
                                      ? `Restocked +${tx.quantity} units`
                                      : tx.type === 'damage'
                                        ? `Damaged -${tx.quantity} units`
                                        : `Adjusted to ${tx.quantity} units`}
                              </span>
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${badge.color}`}
                              >
                                {badge.label}
                              </span>
                            </div>

                            {/* Additional metadata (recipient, reason, performer) */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50 mt-1">
                              {tx.issuedTo && (
                                <span className="flex items-center gap-1 text-white/70">
                                  <UserIcon className="w-3 h-3 text-white/40" />
                                  Issued to: {tx.issuedTo.email}
                                </span>
                              )}
                              {tx.performedBy && (
                                <span className="text-white/40">
                                  Logged by: {tx.performedBy.email}
                                </span>
                              )}
                              {tx.reason && (
                                <span className="italic text-white/60">
                                  &ldquo;{tx.reason}&rdquo;
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-xs font-mono text-white/40 shrink-0 sm:text-right">
                          {formatDate(tx.timestamp)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </m.div>
          </div>
        </div>
      </div>
    </div>
  )
}
