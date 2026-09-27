import { describe, expect, it } from 'vitest'
import {
  isAuthenticated,
  isAdmin,
  isMemberOrAdmin,
  isInternOrAbove,
  isSelfOrAdmin,
} from '../../src/access/roles'

describe('Access Helpers', () => {
  const adminUser = { id: 1, email: 'admin@example.com', role: 'admin' }
  const memberUser = { id: 2, email: 'member@example.com', role: 'member' }
  const internUser = { id: 3, email: 'intern@example.com', role: 'intern' }

  describe('isAuthenticated', () => {
    it('returns false for unauthenticated users', () => {
      expect(isAuthenticated({ req: { user: null } } as any)).toBe(false)
    })
    it('returns true for authenticated users', () => {
      expect(isAuthenticated({ req: { user: internUser } } as any)).toBe(true)
    })
  })

  describe('isAdmin', () => {
    it('returns true for admins', () => {
      expect(isAdmin({ req: { user: adminUser } } as any)).toBe(true)
    })
    it('returns false for non-admins', () => {
      expect(isAdmin({ req: { user: memberUser } } as any)).toBe(false)
      expect(isAdmin({ req: { user: internUser } } as any)).toBe(false)
      expect(isAdmin({ req: { user: null } } as any)).toBe(false)
    })
  })

  describe('isMemberOrAdmin', () => {
    it('returns true for members and admins', () => {
      expect(isMemberOrAdmin({ req: { user: adminUser } } as any)).toBe(true)
      expect(isMemberOrAdmin({ req: { user: memberUser } } as any)).toBe(true)
    })
    it('returns false for interns or unauthenticated users', () => {
      expect(isMemberOrAdmin({ req: { user: internUser } } as any)).toBe(false)
      expect(isMemberOrAdmin({ req: { user: null } } as any)).toBe(false)
    })
  })

  describe('isInternOrAbove', () => {
    it('returns true for any authenticated user', () => {
      expect(isInternOrAbove({ req: { user: adminUser } } as any)).toBe(true)
      expect(isInternOrAbove({ req: { user: memberUser } } as any)).toBe(true)
      expect(isInternOrAbove({ req: { user: internUser } } as any)).toBe(true)
    })
    it('returns false for unauthenticated users', () => {
      expect(isInternOrAbove({ req: { user: null } } as any)).toBe(false)
    })
  })

  describe('isSelfOrAdmin', () => {
    it('returns true if the user is an admin accessing any record', () => {
      expect(isSelfOrAdmin({ req: { user: adminUser }, id: 2 } as any)).toBe(true)
      expect(isSelfOrAdmin({ req: { user: adminUser }, id: undefined } as any)).toBe(true)
    })
    it('returns true if a non-admin is accessing their own record', () => {
      expect(isSelfOrAdmin({ req: { user: memberUser }, id: 2 } as any)).toBe(true)
    })
    it('returns false if a non-admin is accessing another record', () => {
      expect(isSelfOrAdmin({ req: { user: memberUser }, id: 3 } as any)).toBe(false)
    })
    it('returns false if a non-admin is accessing a list (no id)', () => {
      expect(isSelfOrAdmin({ req: { user: memberUser }, id: undefined } as any)).toBe(false)
    })
    it('returns false for unauthenticated users', () => {
      expect(isSelfOrAdmin({ req: { user: null }, id: 2 } as any)).toBe(false)
    })
  })
})
