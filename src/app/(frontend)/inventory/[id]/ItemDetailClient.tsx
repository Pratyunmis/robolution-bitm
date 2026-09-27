'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { m, AnimatePresence } from 'framer-motion'
import DarkVeil from '@/components/DarkVeil'
import { useSmartRefresh } from '@/hooks/useSmartRefresh'
import { useInventoryLiveUpdates } from '@/hooks/useInventoryLiveUpdates'
import LiveStatusBadge from '@/components/inventory/LiveStatusBadge'
import { ArrowLeft, CheckCircle2, FileText } from 'lucide-react'
import type { DetailedInventoryItemDTO, InventoryTransactionDTO, UserRole } from '@/types/inventory'
import { ItemHeader } from '@/components/inventory/ItemHeader'
import { ItemStockMeter } from '@/components/inventory/ItemStockMeter'
import { ItemTimeline } from '@/components/inventory/ItemTimeline'
import { ItemActionModals, DialogType } from '@/components/inventory/ItemActionModals'
import { inventoryApi } from '@/lib/api/inventoryApi'

interface ItemDetailClientProps {
  item: DetailedInventoryItemDTO
  transactions: InventoryTransactionDTO[]
  descriptionHtml: string
  currentUserRole?: UserRole
}

export default function ItemDetailClient({
  item: initialItem,
  transactions: initialTransactions,
  descriptionHtml,
  currentUserRole,
}: ItemDetailClientProps) {
  const [item, setItem] = useState<DetailedInventoryItemDTO>(initialItem)
  const [transactions, setTransactions] = useState<InventoryTransactionDTO[]>(initialTransactions)
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Sync state when server components refresh in background
  useEffect(() => {
    setItem(initialItem)
  }, [initialItem])

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  // Smart polling & tab focus revalidation
  useSmartRefresh({ intervalMs: 15000 })

  // Real-time SSE Live Updates
  const { status: liveStatus } = useInventoryLiveUpdates()

  const availabilityPct =
    item.quantityTotal > 0
      ? Math.round((item.quantityAvailable / item.quantityTotal) * 100)
      : 0
  const isOutOfStock = item.quantityAvailable === 0
  const isLowStock = !isOutOfStock && item.quantityAvailable <= item.minimumStock

  const handleTransactionSuccess = (newTx: InventoryTransactionDTO, updatedItem?: any) => {
    if (updatedItem) {
      setItem((prev) => ({
        ...prev,
        quantityTotal: updatedItem.quantityTotal ?? prev.quantityTotal,
        quantityAvailable: updatedItem.quantityAvailable ?? prev.quantityAvailable,
        quantityIssued: updatedItem.quantityIssued ?? prev.quantityIssued,
        status: updatedItem.status ?? prev.status,
      }))
    }

    setTransactions((prev) => [newTx, ...prev])

    const msgPrefix = newTx.status === 'pending' ? 'Requested' : 'Successfully processed'
    setSuccessMsg(`${msgPrefix} ${newTx.type} of ${newTx.quantity} unit(s)!`)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const handleApprovalAction = async (txId: string, status: 'approved' | 'rejected') => {
    try {
      const data = await inventoryApi.updateApprovalStatus(txId, status)

      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, status: data.transaction?.status ?? status } : t)),
      )

      if (data.updatedItem) {
        setItem((prev) => ({
          ...prev,
          quantityAvailable: data.updatedItem.quantityAvailable ?? prev.quantityAvailable,
          quantityIssued: data.updatedItem.quantityIssued ?? prev.quantityIssued,
          status: data.updatedItem.status ?? prev.status,
        }))
      }

      setSuccessMsg(`Transaction ${status} successfully!`)
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating transaction')
      setTimeout(() => setErrorMsg(null), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden pt-24 pb-32">
      {/* Fixed WebGL Shader Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {successMsg && (
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/90 text-white px-6 py-3 rounded-full backdrop-blur-xl border border-emerald-400/40 shadow-2xl flex items-center gap-2 font-medium text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMsg}</span>
          </m.div>
        )}
      </AnimatePresence>

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
            <Link href="/inventory" className="hover:text-white/70 transition-colors">
              Inventory
            </Link>
            <span>/</span>
            <span className="text-white/60">{item.category.name}</span>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[200px]">{item.name}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image, Quick Specs & Quick Actions (5 cols) */}
          <div className="lg:col-span-5">
            <ItemHeader
              item={item}
              isOutOfStock={isOutOfStock}
              isLowStock={isLowStock}
              currentUserRole={currentUserRole}
              onOpenDialog={(type) => setActiveDialog(type)}
            />
          </div>

          {/* Right Column: Title, Stock Meters, Specs, and Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs uppercase tracking-wider text-white/60 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                  {item.category.name}
                </span>
                <span className="text-xs font-mono text-white/40">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
                {item.name}
              </h1>
            </div>

            {/* Visual Stock Meter & Stats */}
            <ItemStockMeter
              item={item}
              availabilityPct={availabilityPct}
              isOutOfStock={isOutOfStock}
              isLowStock={isLowStock}
            />

            {/* Description & Technical Documentation */}
            {descriptionHtml && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-black/50 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white/50" />
                  <span>Technical Description &amp; Pinout</span>
                </h3>
                <div
                  className="prose prose-invert max-w-none text-white/70 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </m.div>
            )}

            {/* Movement History Timeline */}
            <ItemTimeline
              transactions={transactions}
              currentUserRole={currentUserRole}
              onApprove={(txId) => handleApprovalAction(txId, 'approved')}
              onReject={(txId) => handleApprovalAction(txId, 'rejected')}
            />
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <ItemActionModals
        activeDialog={activeDialog}
        item={item}
        currentUserRole={currentUserRole}
        onClose={() => setActiveDialog(null)}
        onSuccess={handleTransactionSuccess}
      />

      {/* Floating Bottom-Left Real-time SSE Connection Indicator */}
      <LiveStatusBadge status={liveStatus} />
    </div>
  )
}
