import { EventEmitter } from 'events'

export interface InventoryUpdateEvent {
  type: 'TRANSACTION_CREATED' | 'ITEM_UPDATED' | 'BATCH_IMPORTED'
  timestamp: string
  itemId?: string | number
  transactionId?: string | number
  actionType?: string
  quantity?: number
  data?: any
}

// Global singleton to preserve active listeners across Next.js dev hot-reloads
const globalForBus = global as unknown as { inventoryBus?: EventEmitter }

export const inventoryBus = globalForBus.inventoryBus || new EventEmitter()
inventoryBus.setMaxListeners(200)

if (process.env.NODE_ENV !== 'production') {
  globalForBus.inventoryBus = inventoryBus
}

/**
 * Broadcast an inventory mutation event to all active SSE subscribers.
 */
export function broadcastInventoryUpdate(event: InventoryUpdateEvent) {
  try {
    inventoryBus.emit('INVENTORY_UPDATE', event)
  } catch (err) {
    console.error('Error broadcasting inventory update:', err)
  }
}
