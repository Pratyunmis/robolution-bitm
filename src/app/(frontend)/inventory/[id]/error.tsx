'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'

export default function ItemDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Item detail error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-black/60 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Item Not Found or Error</h2>
          <p className="text-sm text-white/60">
            {error.message || 'Unable to retrieve the requested component details.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="rounded-full bg-white text-black hover:bg-gray-100 font-semibold px-6 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/inventory">
            <Button
              variant="outline"
              className="w-full rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
