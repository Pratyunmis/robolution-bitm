'use client'

import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Loader2 } from 'lucide-react'
import type { DetailedInventoryItemDTO, InventoryTransactionDTO, TransactionType, UserRole } from '@/types/inventory'
import { getTransactionTypeConfig } from '@/lib/inventory/transactionConfig'
import { inventoryApi } from '@/lib/api/inventoryApi'

export type DialogType = TransactionType | null

interface ItemActionModalsProps {
  activeDialog: DialogType
  item: DetailedInventoryItemDTO
  currentUserRole?: UserRole
  onClose: () => void
  onSuccess: (transaction: InventoryTransactionDTO, updatedItem: any) => void
}

export function ItemActionModals({
  activeDialog,
  item,
  currentUserRole,
  onClose,
  onSuccess,
}: ItemActionModalsProps) {
  const [quantity, setQuantity] = useState<number>(1)
  const [recipient, setRecipient] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!activeDialog) return null

  const config = getTransactionTypeConfig(activeDialog)
  const Icon = config.icon

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const data = await inventoryApi.recordTransaction({
        itemId: item.id,
        type: activeDialog,
        quantity,
        issuedToEmail: recipient || undefined,
        reason: reason || undefined,
      })

      if (data.transaction) {
        onSuccess(data.transaction, data.updatedItem)
      }
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-950 border border-white/15 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dialog Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl border ${config.badgeColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{config.label}</h3>
              <p className="text-xs text-white/50">{item.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Quantity Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Quantity to {config.actionVerb}
              </label>
              <Input
                type="number"
                min="1"
                max={
                  activeDialog === 'issue' || activeDialog === 'damage'
                    ? item.quantityAvailable
                    : activeDialog === 'return'
                      ? item.quantityIssued
                      : 9999
                }
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-white/5 border-white/15 text-white py-5 rounded-xl text-base"
                required
              />
              <span className="text-[11px] text-white/40 block">
                {activeDialog === 'issue' || activeDialog === 'damage'
                  ? `Max available to select: ${item.quantityAvailable}`
                  : activeDialog === 'return'
                    ? `Max currently checked out: ${item.quantityIssued}`
                    : 'Enter quantity to replenish'}
              </span>
            </div>

            {/* Recipient Email for Checkout */}
            {config.requiresRecipient && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Recipient Member Email (Optional)
                </label>
                <Input
                  type="email"
                  placeholder="e.g. member@bitmesra.ac.in (defaults to you)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-white/5 border-white/15 text-white py-5 rounded-xl text-sm placeholder:text-white/30"
                />
              </div>
            )}

            {/* Reason Textarea (Required for damage/adjust, optional for restock/return) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                {config.requiresReason ? 'Reason / Incident Report (Required)' : 'Notes / Remarks (Optional)'}
              </label>
              <Textarea
                placeholder={
                  activeDialog === 'damage'
                    ? 'Explain how the damage occurred and if component is repairable...'
                    : 'Add any optional context for the lab audit log...'
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required={config.requiresReason}
                className="bg-white/5 border-white/15 text-white rounded-xl text-sm placeholder:text-white/30 min-h-[80px]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-white/10 text-white/70 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-xl text-white font-semibold flex items-center gap-2 cursor-pointer ${
                  activeDialog === 'damage'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {activeDialog === 'issue' && currentUserRole === 'intern'
                    ? 'Submit Request'
                    : `Confirm ${config.actionVerb}`}
                </span>
              </Button>
            </div>
          </form>
        </m.div>
      </div>
    </AnimatePresence>
  )
}
