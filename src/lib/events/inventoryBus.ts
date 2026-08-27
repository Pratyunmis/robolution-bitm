import { EventEmitter } from 'events'
import { initPostgresListener, publishPostgresEvent } from './postgresPubSub'

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
const globalForBus = global as unknown as {
  inventoryBus?: EventEmitter
  postgresListenerInitialized?: boolean
}

export const inventoryBus = globalForBus.inventoryBus || new EventEmitter()
inventoryBus.setMaxListeners(200)

if (process.env.NODE_ENV !== 'production') {
  globalForBus.inventoryBus = inventoryBus
}

// Initialize PostgreSQL multi-instance listener once per process
if (!globalForBus.postgresListenerInitialized && typeof window === 'undefined') {
  globalForBus.postgresListenerInitialized = true
  initPostgresListener((event) => {
    // Received notification from another server instance -> broadcast to local SSE streams
    inventoryBus.emit('INVENTORY_UPDATE', event)
  }).catch((err) => {
    console.warn('Postgres pub/sub initialization notice:', err?.message)
  })
}

/**
 * Broadcast an inventory mutation event to:
 * 1. All local SSE connected clients on this instance.
 * 2. All other server instances/containers via PostgreSQL NOTIFY.
 */
export function broadcastInventoryUpdate(event: InventoryUpdateEvent) {
  try {
    // 1. Local broadcast
    inventoryBus.emit('INVENTORY_UPDATE', event)

    // 2. Multi-instance broadcast across cluster via Postgres NOTIFY
    if (typeof window === 'undefined') {
      publishPostgresEvent(event).catch(() => {})
    }
  } catch (err) {
    console.error('Error broadcasting inventory update:', err)
  }
}
