import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { InventoryCategory } from '@/payload-types'

export interface ImportItemRow {
  name: string
  category: string
  sku?: string
  quantityTotal?: number | string
  minimumStock?: number | string
  location?: string
  description?: string
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to import inventory.' },
        { status: 401 },
      )
    }

    let itemsToImport: ImportItemRow[] = []

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      itemsToImport = Array.isArray(body) ? body : body.items || []
    } else {
      // Parse raw CSV text
      const text = await request.text()
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0)

      if (lines.length <= 1) {
        return NextResponse.json(
          { error: 'CSV file is empty or missing data rows.' },
          { status: 400 },
        )
      }

      // Simple CSV line parser supporting quoted values
      const parseCsvLine = (line: string): string[] => {
        const result: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"'
              i++
            } else {
              inQuotes = !inQuotes
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        result.push(current.trim())
        return result
      }

      const rawHeaders = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[\s_-]+/g, ''))
      const headerMap: Record<string, number> = {}

      rawHeaders.forEach((h, idx) => {
        if (h.includes('name')) headerMap['name'] = idx
        else if (h.includes('sku')) headerMap['sku'] = idx
        else if (h.includes('category')) headerMap['category'] = idx
        else if (h.includes('total') || h.includes('qty') || h.includes('quantity')) headerMap['quantityTotal'] = idx
        else if (h.includes('min') || h.includes('threshold')) headerMap['minimumStock'] = idx
        else if (h.includes('loc') || h.includes('shelf')) headerMap['location'] = idx
        else if (h.includes('desc')) headerMap['description'] = idx
      })

      for (let i = 1; i < lines.length; i++) {
        const cells = parseCsvLine(lines[i])
        if (cells.length === 0 || !cells.some((c) => c.length > 0)) continue

        itemsToImport.push({
          name: headerMap['name'] !== undefined ? cells[headerMap['name']] : cells[0] || '',
          sku: headerMap['sku'] !== undefined ? cells[headerMap['sku']] : cells[1] || undefined,
          category: headerMap['category'] !== undefined ? cells[headerMap['category']] : cells[2] || 'Uncategorized',
          quantityTotal: headerMap['quantityTotal'] !== undefined ? cells[headerMap['quantityTotal']] : '0',
          minimumStock: headerMap['minimumStock'] !== undefined ? cells[headerMap['minimumStock']] : '0',
          location: headerMap['location'] !== undefined ? cells[headerMap['location']] : cells[5] || undefined,
          description: headerMap['description'] !== undefined ? cells[headerMap['description']] : cells[6] || undefined,
        })
      }
    }

    if (itemsToImport.length === 0) {
      return NextResponse.json(
        { error: 'No valid component rows found in the import payload.' },
        { status: 400 },
      )
    }

    // Cache categories to minimize DB calls
    const existingCatsResult = await payload.find({
      collection: 'inventory-categories',
      limit: 200,
    })

    const categoryCache = new Map<string, number>()
    existingCatsResult.docs.forEach((cat: InventoryCategory) => {
      categoryCache.set(cat.name.toLowerCase().trim(), cat.id)
    })

    const errors: string[] = []
    let importedCount = 0

    for (let index = 0; index < itemsToImport.length; index++) {
      const row = itemsToImport[index]
      const rowNum = index + 1

      if (!row.name || row.name.trim() === '') {
        errors.push(`Row ${rowNum}: Item name is required.`)
        continue
      }

      const itemName = row.name.trim()
      const categoryName = (row.category || 'General').trim()
      const catKey = categoryName.toLowerCase()

      let categoryId = categoryCache.get(catKey)

      // Auto-create category if missing
      if (!categoryId) {
        try {
          const newCat = await payload.create({
            collection: 'inventory-categories',
            data: {
              name: categoryName,
              description: `Auto-created category for ${categoryName}`,
            },
            user,
          })
          categoryId = newCat.id
          categoryCache.set(catKey, categoryId)
        } catch (catErr: any) {
          errors.push(`Row ${rowNum}: Failed to create category "${categoryName}": ${catErr.message}`)
          continue
        }
      }

      const totalQty = Math.max(0, parseInt(String(row.quantityTotal || '0'), 10) || 0)
      const minStock = Math.max(0, parseInt(String(row.minimumStock || '0'), 10) || 0)
      const sku = row.sku ? row.sku.trim() : undefined

      // Check for SKU uniqueness if provided
      if (sku) {
        const existingSku = await payload.find({
          collection: 'inventory-items',
          where: {
            sku: {
              equals: sku,
            },
          },
          limit: 1,
        })
        if (existingSku.docs.length > 0) {
          errors.push(`Row ${rowNum}: An item with SKU "${sku}" already exists (${existingSku.docs[0].name}).`)
          continue
        }
      }

      try {
        // Create the Inventory Item
        const newItem = await payload.create({
          collection: 'inventory-items',
          data: {
            name: itemName,
            sku,
            category: categoryId,
            location: row.location?.trim() || undefined,
            minimumStock: minStock,
            status: totalQty > 0 ? 'active' : 'out-of-stock',
          },
          user,
        })

        // If initial quantity was specified, create a restock transaction to update quantities & audit log
        if (totalQty > 0) {
          await payload.create({
            collection: 'inventory-transactions',
            data: {
              item: newItem.id,
              type: 'restock',
              quantity: totalQty,
              reason: 'Initial bulk inventory import',
            },
            user,
          })
        }

        importedCount++
      } catch (itemErr: any) {
        errors.push(`Row ${rowNum} (${itemName}): ${itemErr.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      totalRows: itemsToImport.length,
      errors,
      message: `Successfully imported ${importedCount} of ${itemsToImport.length} items.`,
    })
  } catch (error: any) {
    console.error('Error during bulk import:', error)
    return NextResponse.json(
      { error: error?.message || 'Bulk import failed unexpectedly.' },
      { status: 500 },
    )
  }
}
