'use client'

import Image from 'next/image'

const Logo = (_props?: React.ComponentProps<'div'>) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Image src="/logo.png" alt="Robolution Logo" width={40} height={40} />
      <span className="text-4xl font-bold tracking-wide text-white">Robolution Admin Panel</span>
    </div>
  )
}

export default Logo
