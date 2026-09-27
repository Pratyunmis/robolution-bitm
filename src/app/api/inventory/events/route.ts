import { NextRequest } from 'next/server'
import { inventoryBus, InventoryUpdateEvent } from '@/lib/events/inventoryBus'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial connected event
      try {
        controller.enqueue(
          encoder.encode(
            `event: connected\ndata: ${JSON.stringify({ time: new Date().toISOString(), status: 'connected' })}\n\n`,
          ),
        )
      } catch (_e) {
        return
      }

      // 2. Broadcast listener callback
      const onUpdate = (event: InventoryUpdateEvent) => {
        try {
          controller.enqueue(
            encoder.encode(`event: inventory_update\ndata: ${JSON.stringify(event)}\n\n`),
          )
        } catch (_err) {
          // Stream might be terminating
        }
      }

      inventoryBus.on('INVENTORY_UPDATE', onUpdate)

      // 3. Heartbeat keep-alive every 20 seconds to prevent proxy / load-balancer timeouts
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'))
        } catch (_e) {
          clearInterval(keepAlive)
        }
      }, 20000)

      // 4. Handle client disconnect / abort signal
      request.signal.addEventListener('abort', () => {
        inventoryBus.off('INVENTORY_UPDATE', onUpdate)
        clearInterval(keepAlive)
        try {
          controller.close()
        } catch (_e) {}
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disables NGINX proxy buffering
    },
  })
}
