import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import TransactionsClient, { TransformedAuditTransaction } from './TransactionsClient'
import type { InventoryTransaction, InventoryItem, User } from '@/payload-types'
import type { Metadata } from 'next'

export const revalidate = 0 // Real-time data

export const metadata: Metadata = {
  title: 'Inventory Transaction Log | Robolution',
  description: 'Full audit history of checkouts, returns, restocks, and adjustments for Robolution hardware lab.',
}

export default async function TransactionsPage() {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })

    const transactionsResult = await payload.find({
      collection: 'inventory-transactions',
      limit: 200,
      depth: 2,
      sort: '-timestamp',
    })

    const transactions: TransformedAuditTransaction[] = transactionsResult.docs.map(
      (tx: InventoryTransaction) => {
        const item = typeof tx.item === 'number' ? null : (tx.item as InventoryItem | null)
        const performer = typeof tx.performedBy === 'number' ? null : (tx.performedBy as User | null)
        const recipient = typeof tx.issuedTo === 'number' ? null : (tx.issuedTo as User | null)

        return {
          id: tx.id.toString(),
          type: tx.type,
          quantity: tx.quantity,
          reason: tx.reason || undefined,
          timestamp: tx.timestamp || tx.createdAt,
          item: {
            id: item ? item.id.toString() : (typeof tx.item === 'number' ? tx.item.toString() : ''),
            name: item?.name || 'Unknown Component',
            sku: item?.sku || undefined,
          },
          performedBy: performer ? { id: performer.id.toString(), email: performer.email } : undefined,
          issuedTo: recipient ? { id: recipient.id.toString(), email: recipient.email } : undefined,
          status: tx.status,
        }
      },
    )

    return <TransactionsClient initialTransactions={transactions} currentUserRole={user?.role} />
  } catch (error) {
    console.error('Error fetching inventory transactions:', error)
    return <TransactionsClient initialTransactions={[]} />
  }
}
