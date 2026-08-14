import type { InventoryItem } from '../../payload-types'

export type TransactionType = 'issue' | 'return' | 'adjust' | 'restock'

export interface QuantityResult {
  quantityTotal: number
  quantityAvailable: number
  quantityIssued: number
  status: 'active' | 'out-of-stock' | 'discontinued'
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validates whether a transaction is logically sound given the current state of the item.
 */
export const validateTransaction = (
  item: InventoryItem,
  type: TransactionType,
  quantity: number,
): ValidationResult => {
  if (quantity <= 0) {
    return { valid: false, error: 'Quantity must be greater than zero.' }
  }

  // Treat missing fields as 0 (for new items)
  const available = item.quantityAvailable || 0
  const issued = item.quantityIssued || 0

  if (type === 'issue') {
    if (quantity > available) {
      return {
        valid: false,
        error: `Cannot issue ${quantity} units. Only ${available} available.`,
      }
    }
  }

  if (type === 'return') {
    if (quantity > issued) {
      return {
        valid: false,
        error: `Cannot return ${quantity} units. Only ${issued} are currently issued.`,
      }
    }
  }

  return { valid: true }
}

/**
 * Calculates the new state of an inventory item after applying a transaction.
 * Should only be called after validateTransaction returns valid: true.
 */
export const applyTransaction = (
  item: InventoryItem,
  type: TransactionType,
  quantity: number,
): QuantityResult => {
  // Read current state (default to 0 if undefined, e.g. for brand new items)
  let total = item.quantityTotal || 0
  let available = item.quantityAvailable || 0
  let issued = item.quantityIssued || 0
  let status = item.status || 'active'

  // If item was discontinued, leave it discontinued unless explicit restock logic dictates otherwise
  if (status === 'discontinued') {
    // Keep it discontinued unless adjusting? Actually, restock might revive it, but let's keep it simple: 
    // Status logic below will override based on quantities.
  }

  switch (type) {
    case 'issue':
      available -= quantity
      issued += quantity
      break
    case 'return':
      available += quantity
      issued -= quantity
      break
    case 'restock':
      total += quantity
      available += quantity
      break
    case 'adjust':
      // Adjust directly sets the total. 
      // We assume adjusting the total means available is adjusted by the delta, while issued stays the same.
      // This is a complex scenario, but standard logic: total = newTotal, available = newTotal - issued.
      // Wait, standard 'adjust' in our plan says "sets quantities directly", but the transaction only has one 'quantity' field.
      // Let's assume 'adjust' sets the TOTAL quantity, and available is calculated automatically.
      total = quantity
      available = total - issued
      if (available < 0) {
        // Edge case: if we adjusted total below what's currently issued, available would be negative.
        // We'll set available to 0, and issued to the new total (assuming the missing items are the issued ones).
        // A robust system would require more fields, but for this robotics club, we'll cap it at 0.
        available = 0
        issued = total
      }
      break
  }

  // Auto-manage status
  status = available <= 0 && status !== 'discontinued' ? 'out-of-stock' : 'active'

  return {
    quantityTotal: total,
    quantityAvailable: available,
    quantityIssued: issued,
    status,
  }
}
