import type { TransactionType, TransactionStatus, InventoryTransactionDTO } from '@/types/inventory'

export interface RecordTransactionParams {
  itemId: string | number
  type: TransactionType
  quantity: number
  issuedToEmail?: string
  reason?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  error?: string
  transaction?: T
  updatedItem?: any
}

export class ApiError extends Error {
  statusCode: number
  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

/**
 * Typed client-side API abstraction for inventory operations.
 * Implements DIP by allowing UI components to depend on this contract rather than low-level fetch details.
 */
export const inventoryApi = {
  /**
   * Records a new transaction (checkout, return, restock, adjust, damage).
   */
  async recordTransaction(params: RecordTransactionParams): Promise<ApiResponse<InventoryTransactionDTO>> {
    const response = await fetch('/api/inventory/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new ApiError(data.error || 'Failed to record transaction', response.status)
    }

    return data
  },

  /**
   * Updates approval status (approve / reject) of a pending transaction.
   */
  async updateApprovalStatus(
    transactionId: string | number,
    status: 'approved' | 'rejected',
  ): Promise<ApiResponse<InventoryTransactionDTO>> {
    const response = await fetch(`/api/inventory/transaction/${transactionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new ApiError(data.error || 'Failed to update transaction status', response.status)
    }

    return data
  },
}
