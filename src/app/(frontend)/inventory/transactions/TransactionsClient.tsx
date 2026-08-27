'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { m, AnimatePresence } from 'framer-motion'
import DarkVeil from '@/components/DarkVeil'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Search,
  X,
  Clock,
  Zap,
  RotateCcw,
  PlusCircle,
  ShieldAlert,
  Layers,
  User as UserIcon,
  Filter,
  History,
  FileSpreadsheet,
  Download,
} from 'lucide-react'
import { useSmartRefresh } from '@/hooks/useSmartRefresh'
import { useInventoryLiveUpdates } from '@/hooks/useInventoryLiveUpdates'
import LiveStatusBadge from '@/components/inventory/LiveStatusBadge'

export interface TransformedAuditTransaction {
  id: string
  type: 'issue' | 'return' | 'restock' | 'adjust' | 'damage'
  quantity: number
  reason?: string
  timestamp: string
  item: {
    id: string
    name: string
    sku?: string
  }
  performedBy?: {
    id: string
    email: string
  }
  issuedTo?: {
    id: string
    email: string
  }
}

interface TransactionsClientProps {
  initialTransactions: TransformedAuditTransaction[]
}

const typeFilters = [
  { label: 'All Events', value: 'all' },
  { label: 'Checkouts', value: 'issue' },
  { label: 'Returns', value: 'return' },
  { label: 'Restocks', value: 'restock' },
  { label: 'Damages', value: 'damage' },
  { label: 'Adjustments', value: 'adjust' },
] as const

type TypeFilter = (typeof typeFilters)[number]['value']

export default function TransactionsClient({ initialTransactions }: TransactionsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<TypeFilter>('all')

  // Smart polling & tab focus revalidation
  useSmartRefresh({ intervalMs: 15000 })

  // Real-time SSE Live Updates
  const { status: liveStatus } = useInventoryLiveUpdates()

  const stats = useMemo(() => {
    let checkouts = 0
    let returns = 0
    let restocked = 0
    let damaged = 0

    initialTransactions.forEach((tx) => {
      if (tx.type === 'issue') checkouts += tx.quantity
      if (tx.type === 'return') returns += tx.quantity
      if (tx.type === 'restock') restocked += tx.quantity
      if (tx.type === 'damage') damaged += tx.quantity
    })

    return {
      totalLogs: initialTransactions.length,
      checkouts,
      returns,
      restocked,
      damaged,
    }
  }, [initialTransactions])

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((tx) => {
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchItem = tx.item.name.toLowerCase().includes(q)
        const matchSku = tx.item.sku ? tx.item.sku.toLowerCase().includes(q) : false
        const matchPerformer = tx.performedBy?.email.toLowerCase().includes(q) || false
        const matchRecipient = tx.issuedTo?.email.toLowerCase().includes(q) || false
        const matchReason = tx.reason ? tx.reason.toLowerCase().includes(q) : false

        if (!matchItem && !matchSku && !matchPerformer && !matchRecipient && !matchReason) {
          return false
        }
      }

      return true
    })
  }, [initialTransactions, selectedType, searchQuery])

  const getBadge = (type: TransformedAuditTransaction['type']) => {
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
          label: 'Adjustment',
          icon: Layers,
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        }
    }
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('en-US', {
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
      {/* Fixed WebGL Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between py-6 border-b border-white/10 mb-8">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </Link>

          <span className="text-xs text-white/40 font-mono">Inventory / Transaction Audit</span>
        </div>

        {/* Hero Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-4 text-white/60 border border-white/10 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md">
              <History className="w-3.5 h-3.5 text-white/80" />
              <span>Audit Trail &amp; Movement Log</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
              TRANSACTION LOG
            </h1>
            <p className="text-sm sm:text-base text-white/60 max-w-xl">
              Real-time audit history of every component checked out, returned, restocked, or written off in the lab.
            </p>
          </div>

          <a href="/api/inventory/export?type=transactions" download>
            <Button
              variant="outline"
              className="rounded-full bg-white/5 border-white/15 text-emerald-300 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-400/40 text-xs sm:text-sm px-5 py-2.5 backdrop-blur-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Log (CSV)</span>
            </Button>
          </a>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
            <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Total Logs</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.totalLogs}</span>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 p-5 rounded-2xl backdrop-blur-md">
            <span className="text-xs text-sky-400/80 uppercase tracking-wider block mb-1">Units Issued</span>
            <span className="text-2xl sm:text-3xl font-black text-sky-400">{stats.checkouts}</span>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-md">
            <span className="text-xs text-emerald-400/80 uppercase tracking-wider block mb-1">Units Returned</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.returns}</span>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl backdrop-blur-md">
            <span className="text-xs text-indigo-400/80 uppercase tracking-wider block mb-1">Units Restocked</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-400">{stats.restocked}</span>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="space-y-4 mb-8 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search by component name, SKU, member email, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10 py-5 bg-black/40 border-white/10 text-white placeholder:text-white/40 rounded-2xl text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs uppercase tracking-wider text-white/40 font-semibold pl-1 pr-2 flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {typeFilters.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border ${
                  selectedType === opt.value
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <History className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">No Transactions Found</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto mb-4">
              No audit logs match your search criteria. Try changing the filter type.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
              }}
              variant="outline"
              className="rounded-full text-xs bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTransactions.map((tx) => {
                const badge = getBadge(tx.type)
                const Icon = badge.icon

                return (
                  <m.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl p-5 backdrop-blur-xl transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl border ${badge.color} shrink-0 mt-0.5`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/inventory/${tx.item.id}`}
                            className="font-bold text-base text-white hover:underline underline-offset-2"
                          >
                            {tx.item.name}
                          </Link>

                          {tx.item.sku && (
                            <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/60">
                              {tx.item.sku}
                            </span>
                          )}

                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        {/* Movement details */}
                        <div className="text-sm font-medium text-white/90">
                          {tx.type === 'issue' && (
                            <span>Checked out {tx.quantity} unit(s)</span>
                          )}
                          {tx.type === 'return' && (
                            <span>Returned {tx.quantity} unit(s) to lab</span>
                          )}
                          {tx.type === 'restock' && (
                            <span className="text-indigo-300">Added +{tx.quantity} units to inventory</span>
                          )}
                          {tx.type === 'damage' && (
                            <span className="text-rose-300">Written off -{tx.quantity} damaged unit(s)</span>
                          )}
                          {tx.type === 'adjust' && (
                            <span>Stock adjusted to {tx.quantity} units</span>
                          )}
                        </div>

                        {/* Meta: recipient, actor, note */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 pt-1">
                          {tx.issuedTo && (
                            <span className="flex items-center gap-1 text-white/70">
                              <UserIcon className="w-3.5 h-3.5 text-white/40" />
                              Recipient: {tx.issuedTo.email}
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
                    <div className="text-xs font-mono text-white/40 shrink-0 md:text-right flex items-center md:flex-col gap-1.5 md:gap-0">
                      <Clock className="w-3 h-3 md:hidden text-white/30" />
                      <span>{formatDate(tx.timestamp)}</span>
                    </div>
                  </m.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Bottom-Left Real-time Connection Indicator */}
      <LiveStatusBadge status={liveStatus} />
    </div>
  )
}
