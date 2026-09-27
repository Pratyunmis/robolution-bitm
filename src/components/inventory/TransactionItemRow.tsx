'use client'

import React from 'react'
import Link from 'next/link'
import { m } from 'framer-motion'
import { Clock, User as UserIcon } from 'lucide-react'
import type { InventoryTransactionDTO, UserRole } from '@/types/inventory'
import {
  getTransactionTypeConfig,
  getTransactionStatusConfig,
} from '@/lib/inventory/transactionConfig'

interface TransactionItemRowProps {
  tx: InventoryTransactionDTO
  currentUserRole?: UserRole
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function TransactionItemRow({
  tx,
  currentUserRole,
  onApprove,
  onReject,
}: TransactionItemRowProps) {
  const badge = getTransactionTypeConfig(tx.type)
  const Icon = badge.icon
  const statusConfig = getTransactionStatusConfig(tx.status)

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

  const canApprove = currentUserRole === 'admin' || currentUserRole === 'member'

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl p-5 backdrop-blur-xl transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl border ${badge.badgeColor} shrink-0 mt-0.5`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {tx.item?.id ? (
              <Link
                href={`/inventory/${tx.item.id}`}
                className="font-bold text-base text-white hover:underline underline-offset-2"
              >
                {tx.item.name}
              </Link>
            ) : (
              <span className="font-bold text-base text-white">{tx.item?.name || 'Item'}</span>
            )}

            {tx.item?.sku && (
              <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/60">
                {tx.item.sku}
              </span>
            )}

            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${badge.badgeColor}`}
            >
              {badge.label}
            </span>
          </div>

          {/* Movement details */}
          <div className="text-sm font-medium text-white/90">
            {badge.formatMovement(tx.quantity)}
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
              <span className="text-white/40">Logged by: {tx.performedBy.email}</span>
            )}
            {tx.reason && <span className="italic text-white/60">&ldquo;{tx.reason}&rdquo;</span>}
          </div>
        </div>
      </div>

      {/* Timestamp & Actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="text-xs font-mono text-white/40 flex items-center gap-1.5">
          <Clock className="w-3 h-3 md:hidden text-white/30" />
          <span>{formatDate(tx.timestamp)}</span>
        </div>

        {tx.status === 'pending' && (
          <div className="flex flex-col items-end gap-1.5 mt-1">
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${statusConfig.badgeColor}`}
            >
              Pending Approval
            </span>
            {canApprove && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onApprove(tx.id)}
                  className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-2 py-1 rounded text-xs transition-colors cursor-pointer border border-emerald-500/30"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(tx.id)}
                  className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 px-2 py-1 rounded text-xs transition-colors cursor-pointer border border-rose-500/30"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

        {tx.status === 'rejected' && (
          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-md border border-rose-400/20 mt-1 inline-block w-fit">
            Rejected
          </span>
        )}

        {(tx.status === 'completed' || tx.status === 'approved') && tx.type === 'issue' && (
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 mt-1 inline-block w-fit">
            Approved
          </span>
        )}
      </div>
    </m.div>
  )
}
