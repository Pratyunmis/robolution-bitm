import { describe, expect, it } from 'vitest'
import { applyTransaction, validateTransaction } from '../../src/lib/inventory/quantity'
import type { InventoryItem } from '../../src/payload-types'

describe('Inventory Quantity Logic', () => {
  const baseItem: InventoryItem = {
    id: 1,
    name: 'Test Sensor',
    category: 1,
    quantityTotal: 10,
    quantityAvailable: 10,
    quantityIssued: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  describe('validateTransaction', () => {
    it('fails if quantity is zero or negative', () => {
      expect(validateTransaction(baseItem, 'issue', 0).valid).toBe(false)
      expect(validateTransaction(baseItem, 'issue', -5).valid).toBe(false)
    })

    it('fails to issue more than available', () => {
      const result = validateTransaction(baseItem, 'issue', 15)
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/Cannot issue 15 units/)
    })

    it('fails to return more than issued', () => {
      const result = validateTransaction(baseItem, 'return', 5)
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/Cannot return 5 units/)
    })

    it('allows valid issue and return', () => {
      expect(validateTransaction(baseItem, 'issue', 5).valid).toBe(true)
      const issuedItem = { ...baseItem, quantityAvailable: 5, quantityIssued: 5 }
      expect(validateTransaction(issuedItem, 'return', 3).valid).toBe(true)
    })
  })

  describe('applyTransaction', () => {
    it('applies issue correctly', () => {
      const result = applyTransaction(baseItem, 'issue', 3)
      expect(result.quantityTotal).toBe(10)
      expect(result.quantityAvailable).toBe(7)
      expect(result.quantityIssued).toBe(3)
      expect(result.status).toBe('active')
    })

    it('applies return correctly', () => {
      const issuedItem = { ...baseItem, quantityAvailable: 7, quantityIssued: 3 }
      const result = applyTransaction(issuedItem, 'return', 2)
      expect(result.quantityTotal).toBe(10)
      expect(result.quantityAvailable).toBe(9)
      expect(result.quantityIssued).toBe(1)
    })

    it('applies restock correctly', () => {
      const result = applyTransaction(baseItem, 'restock', 5)
      expect(result.quantityTotal).toBe(15)
      expect(result.quantityAvailable).toBe(15)
      expect(result.quantityIssued).toBe(0)
    })

    it('applies adjust correctly (sets total)', () => {
      const issuedItem = { ...baseItem, quantityAvailable: 7, quantityIssued: 3 }
      const result = applyTransaction(issuedItem, 'adjust', 15)
      expect(result.quantityTotal).toBe(15)
      expect(result.quantityAvailable).toBe(12) // 15 - 3 issued
      expect(result.quantityIssued).toBe(3)
    })

    it('auto-sets status to out-of-stock when available hits 0', () => {
      const result = applyTransaction(baseItem, 'issue', 10)
      expect(result.quantityAvailable).toBe(0)
      expect(result.status).toBe('out-of-stock')
    })

    it('auto-sets status back to active when restocked', () => {
      const oosItem = { ...baseItem, quantityAvailable: 0, status: 'out-of-stock' as const }
      const result = applyTransaction(oosItem, 'restock', 5)
      expect(result.quantityAvailable).toBe(5)
      expect(result.status).toBe('active')
    })

    it('applies damage correctly (decreases total and available)', () => {
      const result = applyTransaction(baseItem, 'damage', 3)
      expect(result.quantityTotal).toBe(7)
      expect(result.quantityAvailable).toBe(7)
      expect(result.quantityIssued).toBe(0)
      expect(result.status).toBe('active')
    })

    it('auto-sets status to out-of-stock when all units are damaged', () => {
      const result = applyTransaction(baseItem, 'damage', 10)
      expect(result.quantityTotal).toBe(0)
      expect(result.quantityAvailable).toBe(0)
      expect(result.status).toBe('out-of-stock')
    })
  })

  describe('damage validation', () => {
    it('fails to damage more than available', () => {
      const result = validateTransaction(baseItem, 'damage', 15)
      expect(result.valid).toBe(false)
      expect(result.error).toMatch(/Cannot write off 15 units/)
    })

    it('allows valid damage transaction', () => {
      expect(validateTransaction(baseItem, 'damage', 5).valid).toBe(true)
    })
  })
})
