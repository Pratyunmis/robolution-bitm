import React from 'react'
import type { ServerProps } from 'payload'

export default function AdminDashboardBanner(props: ServerProps) {
  const user = props?.user as any
  const role = user?.role || 'member'
  const email = user?.email || 'admin@robolutionbitm.in'
  const isAdmin = role === 'admin'

  return (
    <div className="robolution-hud-banner">
      {/* Top Telemetry Bar */}
      <div className="robolution-hud-telemetry">
        <div className="robolution-hud-indicator">
          <span className="robolution-hud-pulse" />
          <span className="robolution-hud-status">SYSTEM ONLINE</span>
        </div>
        <div className="robolution-hud-meta">
          <span>ROBOLUTION // OS v3.85</span>
          <span className="divider">•</span>
          <span>BIT MESRA</span>
          <span className="divider">•</span>
          <span>NODE: PRATYUMNIS-HQ</span>
        </div>
      </div>

      {/* Main Banner Body */}
      <div className="robolution-hud-content">
        <div className="robolution-hud-title-wrap">
          <div className="robolution-hud-badge">
            <span className="badge-dot" />
            <span className="badge-text">
              {isAdmin ? 'ROOT LEVEL ADMIN ACCESS' : 'CLUB MEMBER WORKSPACE'}
            </span>
          </div>
          <h1 className="robolution-hud-title">
            ROBOLUTION <span className="title-accent">HUB</span>
          </h1>
          <p className="robolution-hud-sub">
            Logged in as <strong className="user-email">{email}</strong> ({role.toUpperCase()}). Manage club rosters, events, announcements, robot showcase, and equipment inventories.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="robolution-hud-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="robolution-hud-btn secondary"
          >
            <span>Live Website</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
          <a
            href="/inventory"
            target="_blank"
            rel="noopener noreferrer"
            className="robolution-hud-btn primary"
          >
            <span>Lab Inventory</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
