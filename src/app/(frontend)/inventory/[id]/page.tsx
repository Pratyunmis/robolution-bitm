import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ItemDetailClient from './ItemDetailClient'
import { InventoryService } from '@/services/inventory.service'
import type { Metadata } from 'next'

export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const payload = await getPayload({ config })
    const item = await payload.findByID({
      collection: 'inventory-items',
      id: Number(id),
    })
    return {
      title: `${item.name} | Robolution Inventory`,
      description: `Check live availability, specifications, and checkout history for ${item.name} at Robolution Hardware Lab.`,
    }
  } catch (_e) {
    return {
      title: 'Item Details | Robolution Inventory',
    }
  }
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params

  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })

    const result = await InventoryService.getItemDetails(payload, Number(id))
    if (!result) {
      return notFound()
    }

    return (
      <ItemDetailClient
        item={result.item}
        transactions={result.transactions}
        descriptionHtml={result.descriptionHtml}
        currentUserRole={user?.role}
      />
    )
  } catch (error) {
    console.error('Error fetching inventory item details:', error)
    return notFound()
  }
}
