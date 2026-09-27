import { getPayload } from 'payload'
import config from '@/payload.config'
import InventoryClient from './InventoryClient'
import { InventoryService } from '@/services/inventory.service'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hardware Lab Inventory | Robolution BIT Mesra',
  description: 'Real-time component catalog and inventory status for the Robolution lab.',
}

export const revalidate = 0

export default async function InventoryPage() {
  try {
    const payload = await getPayload({ config })
    const { items, categories, stats } = await InventoryService.getInventoryCatalog(payload)

    return <InventoryClient initialItems={items} categories={categories} stats={stats} />
  } catch (error) {
    console.error('Error fetching inventory data:', error)
    return (
      <InventoryClient
        initialItems={[]}
        categories={[]}
        stats={{
          totalItems: 0,
          totalUnits: 0,
          totalAvailable: 0,
          totalIssued: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
        }}
      />
    )
  }
}
