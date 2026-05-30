'use client'

import Image from 'next/image'

const Logo = (_props?: React.ComponentProps<'div'>) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Image
        src="/logo.png"
        alt="Robolution Logo"
        width={40}
        height={40}
        style={{ borderRadius: '100%' }}
      />
      <span
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
        }}
      >
        Robolution
      </span>
    </div>
  )
}

export default Logo
