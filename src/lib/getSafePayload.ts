import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

let payloadPromise: Promise<Payload | null> | null = null

export async function getSafePayload(): Promise<Payload | null> {
  try {
    if (!payloadPromise) {
      payloadPromise = getPayload({ config }).catch((err) => {
        console.warn(
          '[Payload DB Notice] PostgreSQL server is currently offline or unreachable. Serving fallback page content.',
          err.message
        )
        return null
      })
    }
    return await payloadPromise
  } catch {
    return null
  }
}
