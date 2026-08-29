import { getPayload } from 'payload'
import config from '@/payload.config'
import { renderLexical } from '@/lib/lexicalToHtml'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ItemDetailClient, {
  DetailedInventoryItem,
  TransformedTransaction,
} from './ItemDetailClient'
import type {
  InventoryItem,
  InventoryCategory,
  InventoryTransaction,
  Media,
  User,
} from '@/payload-types'
import type { Metadata } from 'next'

export const revalidate = 0 // Real-time data

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const payload = await getPayload({ config })
    const item = await payload.findByID({
      collection: 'inventory-items',
      id,
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

    // Fetch the specific inventory item with depth: 2
    const item = (await payload.findByID({
      collection: 'inventory-items',
      id,
      depth: 2,
    })) as InventoryItem

    if (!item) {
      return notFound()
    }

    // Render description if it exists
    const descriptionHtml = item.description
      ? await renderLexical(item.description as any)
      : ''

    let imgUrl: string | undefined = undefined
    if (item.image) {
      if (typeof item.image === 'object' && 'url' in item.image && item.image.url) {
        imgUrl = item.image.url
      } else if (typeof item.image === 'number' || typeof item.image === 'string') {
        try {
          const mediaDoc = (await payload.findByID({
            collection: 'media',
            id: item.image,
          })) as Media
          imgUrl = mediaDoc?.url || undefined
        } catch (_e) {
          // ignore
        }
      }
    }

    const cat = typeof item.category === 'number' ? null : (item.category as InventoryCategory | null)

    const detailedItem: DetailedInventoryItem = {
      id: item.id.toString(),
      name: item.name,
      sku: item.sku || undefined,
      category: {
        id: cat?.id ? cat.id.toString() : (typeof item.category === 'number' ? item.category.toString() : ''),
        name: cat?.name || 'Uncategorized',
      },
      imageUrl: imgUrl,
      location: item.location || undefined,
      quantityTotal: item.quantityTotal ?? 0,
      quantityAvailable: item.quantityAvailable ?? 0,
      quantityIssued: item.quantityIssued ?? 0,
      minimumStock: item.minimumStock ?? 0,
      status: item.status || ((item.quantityAvailable ?? 0) <= 0 ? 'out-of-stock' : 'active'),
      updatedAt: item.updatedAt,
      createdAt: item.createdAt,
    }

    // Fetch transactions for this item
    const transactionsResult = await payload.find({
      collection: 'inventory-transactions',
      where: {
        item: {
          equals: id,
        },
      },
      sort: '-timestamp',
      limit: 30,
    })

    const transactions: TransformedTransaction[] = transactionsResult.docs.map(
      (tx: InventoryTransaction) => {
        const performer = typeof tx.performedBy === 'number' ? null : (tx.performedBy as User | null)
        const recipient = typeof tx.issuedTo === 'number' ? null : (tx.issuedTo as User | null)

        return {
          id: tx.id.toString(),
          type: tx.type,
          quantity: tx.quantity,
          reason: tx.reason || undefined,
          timestamp: tx.timestamp || tx.createdAt,
          performedBy: performer ? { id: performer.id.toString(), email: performer.email } : undefined,
          issuedTo: recipient ? { id: recipient.id.toString(), email: recipient.email } : undefined,
          status: tx.status,
        }
      },
    )

    return (
      <ItemDetailClient
        item={detailedItem}
        transactions={transactions}
        descriptionHtml={descriptionHtml}
        currentUserRole={user?.role}
      />
    )
  } catch (error) {
    console.error('Error fetching inventory item details:', error)
    return notFound()
  }
}
