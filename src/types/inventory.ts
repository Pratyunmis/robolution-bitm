import type { User } from '@/payload-types'

export type UserRole = NonNullable<User['role']>

export type TransactionType = 'issue' | 'return' | 'restock' | 'adjust' | 'damage'

export type TransactionStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled'

export interface InventoryCategoryDTO {
  id: string
  name: string
  description?: string
  imageUrl?: string
}

export interface InventoryItemDTO {
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
}

export interface DetailedInventoryItemDTO extends InventoryItemDTO {
  createdAt: string
  descriptionHtml?: string
}

export interface InventoryTransactionDTO {
  id: string
  type: TransactionType
  quantity: number
  reason?: string
  timestamp: string
  item?: {
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
  status?: TransactionStatus | null
}

export interface InventoryStatsDTO {
  totalItems: number
  totalUnits: number
  totalAvailable: number
  totalIssued: number
  lowStockCount: number
  outOfStockCount: number
}
