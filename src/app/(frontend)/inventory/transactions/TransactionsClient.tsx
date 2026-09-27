'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import DarkVeil from '@/components/DarkVeil'
import { Button } from '@/components/ui/button'
import { ArrowLeft, History, Download } from 'lucide-react'
import { useSmartRefresh } from '@/hooks/useSmartRefresh'
import { useInventoryLiveUpdates } from '@/hooks/useInventoryLiveUpdates'
import LiveStatusBadge from '@/components/inventory/LiveStatusBadge'
import type { InventoryTransactionDTO, UserRole } from '@/types/inventory'
import { TransactionStats } from '@/components/inventory/TransactionStats'
import { TransactionFilters, TypeFilter } from '@/components/inventory/TransactionFilters'
import { TransactionItemRow } from '@/components/inventory/TransactionItemRow'
import { inventoryApi } from '@/lib/api/inventoryApi'

interface TransactionsClientProps {
  initialTransactions: InventoryTransactionDTO[]
  currentUserRole?: UserRole
}

export default function TransactionsClient({
  initialTransactions,
  currentUserRole,
}: TransactionsClientProps) {
  const [transactions, setTransactions] = useState<InventoryTransactionDTO[]>(initialTransactions)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<TypeFilter>('all')

  // Smart polling & tab focus revalidation
  useSmartRefresh({ intervalMs: 15000 })

  // Real-time SSE Live Updates
  const { status: liveStatus } = useInventoryLiveUpdates()

  // Keep synced if server props update
  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  const stats = useMemo(() => {
    let checkouts = 0
    let returns = 0
    let restocked = 0
    let damaged = 0

    transactions.forEach((tx) => {
      if (tx.type === 'issue') checkouts += tx.quantity
      if (tx.type === 'return') returns += tx.quantity
      if (tx.type === 'restock') restocked += tx.quantity
      if (tx.type === 'damage') damaged += tx.quantity
    })

    return {
      totalLogs: transactions.length,
      checkouts,
      returns,
      restocked,
      damaged,
    }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchItem = tx.item?.name.toLowerCase().includes(q) || false
        const matchSku = tx.item?.sku ? tx.item.sku.toLowerCase().includes(q) : false
        const matchPerformer = tx.performedBy?.email.toLowerCase().includes(q) || false
        const matchRecipient = tx.issuedTo?.email.toLowerCase().includes(q) || false
        const matchReason = tx.reason ? tx.reason.toLowerCase().includes(q) : false

        if (!matchItem && !matchSku && !matchPerformer && !matchRecipient && !matchReason) {
          return false
        }
      }

      return true
    })
  }, [transactions, selectedType, searchQuery])

  const handleApproval = async (txId: string, status: 'approved' | 'rejected') => {
    try {
      const data = await inventoryApi.updateApprovalStatus(txId, status)
      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, status: data.transaction?.status ?? status } : t)),
      )
    } catch (err: any) {
      console.error('Failed to update transaction approval:', err)
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
        <TransactionStats
          totalLogs={stats.totalLogs}
          checkouts={stats.checkouts}
          returns={stats.returns}
          restocked={stats.restocked}
        />

        {/* Filter & Search Toolbar */}
        <TransactionFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          onSearchChange={setSearchQuery}
          onTypeChange={setSelectedType}
        />

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
              className="rounded-full text-xs bg-white/10 border-white/20 text-white hover:bg-white hover:text-black cursor-pointer"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTransactions.map((tx) => (
                <TransactionItemRow
                  key={tx.id}
                  tx={tx}
                  currentUserRole={currentUserRole}
                  onApprove={(id) => handleApproval(id, 'approved')}
                  onReject={(id) => handleApproval(id, 'rejected')}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Bottom-Left Real-time Connection Indicator */}
      <LiveStatusBadge status={liveStatus} />
    </div>
  )
}
export type { InventoryTransactionDTO as TransformedAuditTransaction }
