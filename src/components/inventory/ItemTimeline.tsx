'use client'

import React from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Clock, User as UserIcon } from 'lucide-react'
import type { InventoryTransactionDTO, UserRole } from '@/types/inventory'
import {
  getTransactionTypeConfig,
  getTransactionStatusConfig,
} from '@/lib/inventory/transactionConfig'

interface ItemTimelineProps {
  transactions: InventoryTransactionDTO[]
  currentUserRole?: UserRole
  onApprove: (txId: string) => Promise<void>
  onReject: (txId: string) => Promise<void>
}

export function ItemTimeline({
  transactions,
  currentUserRole,
  onApprove,
  onReject,
}: ItemTimelineProps) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-black/50 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-white/50" />
          <span>Movement History &amp; Audit</span>
        </h3>
        <span className="text-xs text-white/40 font-mono">
          {transactions.length} recorded events
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/5 text-sm">
          No transactions recorded yet for this item.
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {transactions.map((tx) => {
              const badge = getTransactionTypeConfig(tx.type)
              const Icon = badge.icon
              const statusConfig = getTransactionStatusConfig(tx.status)

              return (
                <m.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${badge.badgeColor} shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {badge.formatMovement(tx.quantity)}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${badge.badgeColor}`}
                        >
                          {badge.label}
                        </span>
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

                  {/* Timestamp & Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs font-mono text-white/40">
                      {formatDate(tx.timestamp)}
                    </span>

                    {tx.status === 'pending' && (
                      <div className="flex flex-col items-end gap-1.5 mt-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${statusConfig.badgeColor}`}>
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
            })}
          </AnimatePresence>
        </div>
      )}
    </m.div>
  )
}
