'use client'

import Image from 'next/image'

const Logo = (_props?: React.ComponentProps<'div'>) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
      <Image
        src="/logo.png"
        alt="Robolution Logo"
        width={36}
        height={36}
        style={{
          filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.7))',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              color: '#ffffff',
              fontFamily: 'var(--font-space-grotesk), monospace, sans-serif',
              textTransform: 'uppercase',
              textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
            }}
          >
            ROBOLUTION
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontFamily: 'monospace',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid rgba(0, 240, 255, 0.5)',
              color: '#00f0ff',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
            }}
          >
            PANEL
          </span>
        </div>
        <span
          style={{
            fontSize: '0.65rem',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: '-2px',
          }}
        >
          BIT MESRA • TEAM PRATYUMNIS
        </span>
      </div>
    </div>
  )
}

export default Logo
