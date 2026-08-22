import { getPayload } from 'payload'
import config from '@/payload.config'
import InventoryClient, { TransformedCategory, TransformedInventoryItem, InventoryStats } from './InventoryClient'
import type { InventoryItem, InventoryCategory, Media } from '@/payload-types'

export const revalidate = 0 // Real-time data for internal inventory

async function getInventoryData(): Promise<{
  items: TransformedInventoryItem[]
  categories: TransformedCategory[]
  stats: InventoryStats
}> {
  try {
    const payload = await getPayload({ config })

    // Fetch categories
    const categoriesResult = await payload.find({
      collection: 'inventory-categories',
      limit: 100,
      sort: 'name',
    })

    const categories: TransformedCategory[] = categoriesResult.docs.map((cat: InventoryCategory) => {
      const img = typeof cat.image === 'number' ? null : (cat.image as Media | null)
      return {
        id: cat.id.toString(),
        name: cat.name,
        description: cat.description || undefined,
        imageUrl: img?.url || undefined,
      }
    })

    // Fetch items with populated category and image
    const itemsResult = await payload.find({
      collection: 'inventory-items',
      limit: 200,
      depth: 2,
      sort: 'name',
    })

    let totalUnits = 0
    let totalAvailable = 0
    let totalIssued = 0
    let lowStockCount = 0
    let outOfStockCount = 0

    const items: TransformedInventoryItem[] = itemsResult.docs.map((item: InventoryItem) => {
      let imgUrl: string | undefined = undefined
      if (item.image) {
        if (typeof item.image === 'object' && 'url' in item.image && item.image.url) {
          imgUrl = item.image.url
        }
      }
      const cat = typeof item.category === 'number' ? null : (item.category as InventoryCategory | null)

      const qtyTotal = item.quantityTotal ?? 0
      const qtyAvailable = item.quantityAvailable ?? 0
      const qtyIssued = item.quantityIssued ?? 0
      const minStock = item.minimumStock ?? 0

      totalUnits += qtyTotal
      totalAvailable += qtyAvailable
      totalIssued += qtyIssued

      if (qtyAvailable === 0) {
        outOfStockCount++
      } else if (qtyAvailable <= minStock) {
        lowStockCount++
      }

      return {
        id: item.id.toString(),
        name: item.name,
        sku: item.sku || undefined,
        category: {
          id: cat?.id ? cat.id.toString() : (typeof item.category === 'number' ? item.category.toString() : ''),
          name: cat?.name || 'Uncategorized',
        },
        imageUrl: imgUrl,
        location: item.location || undefined,
        quantityTotal: qtyTotal,
        quantityAvailable: qtyAvailable,
        quantityIssued: qtyIssued,
        minimumStock: minStock,
        status: item.status || (qtyAvailable <= 0 ? 'out-of-stock' : 'active'),
        updatedAt: item.updatedAt,
      }
    })

    const stats: InventoryStats = {
      totalItems: items.length,
      totalUnits,
      totalAvailable,
      totalIssued,
      lowStockCount,
      outOfStockCount,
    }

    return { items, categories, stats }
  } catch (error) {
    console.error('Error fetching inventory data:', error)
    return {
      items: [],
      categories: [],
      stats: {
        totalItems: 0,
        totalUnits: 0,
        totalAvailable: 0,
        totalIssued: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      },
    }
  }
}

export default async function InventoryPage() {
  const { items, categories, stats } = await getInventoryData()

  return <InventoryClient initialItems={items} categories={categories} stats={stats} />
}
