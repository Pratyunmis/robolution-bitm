import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import TransactionsClient from './TransactionsClient'
import { InventoryService } from '@/services/inventory.service'
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

    const transactions = await InventoryService.getAuditTransactions(payload, 200)

    return <TransactionsClient initialTransactions={transactions} currentUserRole={user?.role} />
  } catch (error) {
    console.error('Error fetching inventory transactions:', error)
    return <TransactionsClient initialTransactions={[]} />
  }
}
