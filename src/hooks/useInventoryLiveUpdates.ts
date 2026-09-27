'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { InventoryUpdateEvent } from '@/lib/events/inventoryBus'

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

interface LiveUpdateOptions {
  onEvent?: (eventData: InventoryUpdateEvent) => void
  enabled?: boolean
}

/**
 * Client hook that subscribes to Server-Sent Events (SSE) from /api/inventory/events.
 * Whenever a transaction or stock change happens anywhere, it revalidates server components
 * and fires custom callbacks with sub-second latency.
 */
export function useInventoryLiveUpdates({ onEvent, enabled = true }: LiveUpdateOptions = {}) {
  const router = useRouter()
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    let eventSource: EventSource | null = null
    let reconnectTimer: NodeJS.Timeout | null = null

    const connect = () => {
      try {
        eventSource = new EventSource('/api/inventory/events')

        eventSource.addEventListener('connected', () => {
          setStatus('connected')
        })

        eventSource.addEventListener('inventory_update', (e) => {
          try {
            const data: InventoryUpdateEvent = JSON.parse(e.data)
            router.refresh()
            if (onEvent) {
              onEvent(data)
            }
          } catch (err) {
            console.error('Failed to parse SSE inventory update:', err)
          }
        })

        eventSource.onerror = () => {
          setStatus('disconnected')
          if (eventSource) {
            eventSource.close()
          }
          // Attempt automatic reconnection after 3 seconds
          if (reconnectTimer) clearTimeout(reconnectTimer)
          reconnectTimer = setTimeout(connect, 3000)
        }
      } catch (_err) {
        setStatus('disconnected')
      }
    }

    connect()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }
    }
  }, [router, enabled, onEvent])

  return { status }
}
