'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SmartRefreshOptions {
  /** Polling interval in milliseconds when tab is visible. Default: 15000 (15s) */
  intervalMs?: number
  /** Whether smart refreshing is enabled. Default: true */
  enabled?: boolean
  /** Optional callback fired when refresh triggers */
  onRefresh?: () => void
}

/**
 * Smart polling and tab-focused revalidation hook for Next.js App Router.
 * - Refreshes on window focus
 * - Refreshes on tab visibility change (switching back to tab)
 * - Heartbeat interval polling (throttled, only when tab is active)
 */
export function useSmartRefresh({
  intervalMs = 15000,
  enabled = true,
  onRefresh,
}: SmartRefreshOptions = {}) {
  const router = useRouter()
  const lastRefreshRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!enabled) return

    const triggerRefresh = () => {
      const now = Date.now()
      // Throttle rapid triggers (minimum 2.5s between refreshes to avoid excessive server load)
      if (now - lastRefreshRef.current > 2500) {
        lastRefreshRef.current = now
        router.refresh()
        if (onRefresh) {
          onRefresh()
        }
      }
    }

    // 1. Revalidate on window focus
    const handleFocus = () => {
      triggerRefresh()
    }

    // 2. Revalidate when switching back to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        triggerRefresh()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 3. Background heartbeat timer (only runs when tab is active and visible)
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        triggerRefresh()
      }
    }, intervalMs)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(intervalId)
    }
  }, [router, intervalMs, enabled, onRefresh])
}
