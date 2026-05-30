'use client'

import Image from 'next/image'

const Logo = (_props?: React.ComponentProps<'div'>) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Image src="/logo.png" alt="Robolution Logo" width={40} height={40} />
      <span style={{ fontSize: '2rem', textWrap: 'nowrap', fontWeight: "bold" }}>Robolution Admin Panel</span>
    </div>
  )
}

export default Logo
