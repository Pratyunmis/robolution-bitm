import { Client, Pool } from 'pg'
import type { InventoryUpdateEvent } from './inventoryBus'

const CHANNEL = 'robolution_inventory_events'

// Instance ID to filter out self-originated loopback notifications
export const CURRENT_INSTANCE_ID = Math.random().toString(36).substring(2, 10)

interface EnvelopeEvent {
  instanceId: string
  payload: InventoryUpdateEvent
}

let listenerClient: Client | null = null
let publisherPool: Pool | null = null
let isListening = false
let reconnectTimeout: NodeJS.Timeout | null = null

function getDatabaseUri(): string | undefined {
  return process.env.DATABASE_URI
}

/**
 * Initialize Postgres LISTEN/NOTIFY listener connection.
 * Listens for events published across multiple server instances/workers.
 */
export async function initPostgresListener(
  onMessage: (event: InventoryUpdateEvent) => void,
) {
  const dbUri = getDatabaseUri()
  if (!dbUri || isListening) return

  const connectListener = async () => {
    try {
      if (listenerClient) {
        try {
          await listenerClient.end()
        } catch (_e) {}
      }

      listenerClient = new Client({ connectionString: dbUri })
      await listenerClient.connect()
      isListening = true

      await listenerClient.query(`LISTEN ${CHANNEL}`)

      listenerClient.on('notification', (msg) => {
        if (msg.channel === CHANNEL && msg.payload) {
          try {
            const envelope: EnvelopeEvent = JSON.parse(msg.payload)
            // Only process events originating from other instances
            if (envelope.instanceId !== CURRENT_INSTANCE_ID) {
              onMessage(envelope.payload)
            }
          } catch (err) {
            console.error('Failed to parse Postgres notification payload:', err)
          }
        }
      })

      listenerClient.on('error', (err) => {
        console.warn('Postgres pub/sub listener connection error:', err.message)
        isListening = false
        scheduleReconnect(onMessage)
      })

      listenerClient.on('end', () => {
        isListening = false
        scheduleReconnect(onMessage)
      })
    } catch (err: any) {
      console.warn('Could not establish Postgres pub/sub listener:', err.message)
      isListening = false
      scheduleReconnect(onMessage)
    }
  }

  await connectListener()
}

function scheduleReconnect(onMessage: (event: InventoryUpdateEvent) => void) {
  if (reconnectTimeout) clearTimeout(reconnectTimeout)
  reconnectTimeout = setTimeout(() => {
    initPostgresListener(onMessage)
  }, 5000)
}

/**
 * Publish an event to PostgreSQL so other server instances receive it.
 */
export async function publishPostgresEvent(event: InventoryUpdateEvent): Promise<void> {
  const dbUri = getDatabaseUri()
  if (!dbUri) return

  try {
    if (!publisherPool) {
      publisherPool = new Pool({
        connectionString: dbUri,
        max: 3,
        idleTimeoutMillis: 10000,
      })
    }

    const envelope: EnvelopeEvent = {
      instanceId: CURRENT_INSTANCE_ID,
      payload: event,
    }

    const payloadStr = JSON.stringify(envelope)
    await publisherPool.query('SELECT pg_notify($1, $2)', [CHANNEL, payloadStr])
  } catch (err: any) {
    console.warn('Failed to broadcast via Postgres NOTIFY:', err.message)
  }
}
