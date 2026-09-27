'use client'

import React from 'react'
import Image from 'next/image'

export default function AdminIcon() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image
        src="/logo.png"
        alt="Robolution Icon"
        width={28}
        height={28}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))',
          borderRadius: '50%',
        }}
      />
    </div>
  )
}
