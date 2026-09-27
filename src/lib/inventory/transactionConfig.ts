import {
  Zap,
  RotateCcw,
  PlusCircle,
  ShieldAlert,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  type LucideIcon,
} from 'lucide-react'
import type { TransactionType, TransactionStatus } from '@/types/inventory'

export interface TransactionTypeConfig {
  type: TransactionType
  label: string
  actionVerb: string
  icon: LucideIcon
  badgeColor: string
  requiresRecipient: boolean
  requiresReason: boolean
  description: string
  formatMovement: (quantity: number) => string
}

export interface TransactionStatusConfig {
  status: TransactionStatus
  label: string
  badgeColor: string
  icon: LucideIcon
}

export const TRANSACTION_TYPE_CONFIG: Record<TransactionType, TransactionTypeConfig> = {
  issue: {
    type: 'issue',
    label: 'Checkout',
    actionVerb: 'Check Out',
    icon: Zap,
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    requiresRecipient: true,
    requiresReason: false,
    description: 'Issue hardware components to a club member for project usage.',
    formatMovement: (quantity) => `Checked out ${quantity} unit(s)`,
  },
  return: {
    type: 'return',
    label: 'Return',
    actionVerb: 'Return to Lab',
    icon: RotateCcw,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    requiresRecipient: false,
    requiresReason: false,
    description: 'Check returned components back into lab inventory.',
    formatMovement: (quantity) => `Returned ${quantity} unit(s) to lab`,
  },
  restock: {
    type: 'restock',
    label: 'Restock',
    actionVerb: 'Restock Units',
    icon: PlusCircle,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    requiresRecipient: false,
    requiresReason: false,
    description: 'Add new purchases or replenished parts into inventory stock.',
    formatMovement: (quantity) => `Added +${quantity} units to inventory`,
  },
  damage: {
    type: 'damage',
    label: 'Damage Write-off',
    actionVerb: 'Report Damaged',
    icon: ShieldAlert,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    requiresRecipient: false,
    requiresReason: true,
    description: 'Write off broken or destroyed components with a mandatory reason.',
    formatMovement: (quantity) => `Written off -${quantity} damaged unit(s)`,
  },
  adjust: {
    type: 'adjust',
    label: 'Adjustment',
    actionVerb: 'Adjust Total',
    icon: Layers,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    requiresRecipient: false,
    requiresReason: true,
    description: 'Manually correct physical stock counts following an audit.',
    formatMovement: (quantity) => `Stock adjusted to ${quantity} units`,
  },
}

export const TRANSACTION_STATUS_CONFIG: Record<TransactionStatus, TransactionStatusConfig> = {
  pending: {
    status: 'pending',
    label: 'Pending Approval',
    badgeColor: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    icon: Clock,
  },
  approved: {
    status: 'approved',
    label: 'Approved',
    badgeColor: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    icon: CheckCircle2,
  },
  completed: {
    status: 'completed',
    label: 'Completed',
    badgeColor: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    icon: CheckCircle2,
  },
  rejected: {
    status: 'rejected',
    label: 'Rejected',
    badgeColor: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
    icon: XCircle,
  },
  cancelled: {
    status: 'cancelled',
    label: 'Cancelled',
    badgeColor: 'bg-white/10 text-white/50 border-white/10',
    icon: MinusCircle,
  },
}

export function getTransactionTypeConfig(type: TransactionType): TransactionTypeConfig {
  return TRANSACTION_TYPE_CONFIG[type] ?? TRANSACTION_TYPE_CONFIG.issue
}

export function getTransactionStatusConfig(status?: TransactionStatus | null): TransactionStatusConfig {
  if (!status) return TRANSACTION_STATUS_CONFIG.completed
  return TRANSACTION_STATUS_CONFIG[status] ?? TRANSACTION_STATUS_CONFIG.completed
}
