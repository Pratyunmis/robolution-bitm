import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { InventoryItem, InventoryCategory, InventoryTransaction, User } from '@/payload-types'

function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""'
  const str = String(value)
  return `"${str.replace(/"/g, '""')}"`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exportType = searchParams.get('type') || 'items'
    const payload = await getPayload({ config })
    const today = new Date().toISOString().split('T')[0]

    if (exportType === 'transactions') {
      // Export Transactions
      const txResult = await payload.find({
        collection: 'inventory-transactions',
        limit: 1000,
        depth: 2,
        sort: '-timestamp',
      })

      const headers = [
        'Transaction ID',
        'Date & Time',
        'Component Name',
        'SKU',
        'Transaction Type',
        'Quantity',
        'Recipient (Issued To)',
        'Logged By (Performer)',
        'Reason / Notes',
      ]

      const rows = txResult.docs.map((tx: InventoryTransaction) => {
        const item = typeof tx.item === 'number' ? null : (tx.item as InventoryItem | null)
        const performer = typeof tx.performedBy === 'number' ? null : (tx.performedBy as User | null)
        const recipient = typeof tx.issuedTo === 'number' ? null : (tx.issuedTo as User | null)

        return [
          escapeCsvCell(tx.id),
          escapeCsvCell(tx.timestamp || tx.createdAt),
          escapeCsvCell(item?.name || 'N/A'),
          escapeCsvCell(item?.sku || 'N/A'),
          escapeCsvCell(tx.type.toUpperCase()),
          escapeCsvCell(tx.quantity),
          escapeCsvCell(recipient?.email || 'N/A'),
          escapeCsvCell(performer?.email || 'N/A'),
          escapeCsvCell(tx.reason || ''),
        ].join(',')
      })

      const csvContent = [headers.join(','), ...rows].join('\r\n')

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="robolution-transactions-${today}.csv"`,
        },
      })
    } else {
      // Export Items
      const itemsResult = await payload.find({
        collection: 'inventory-items',
        limit: 1000,
        depth: 1,
        sort: 'name',
      })

      const headers = [
        'ID',
        'Name',
        'SKU',
        'Category',
        'Total Quantity',
        'Available in Lab',
        'Currently Issued',
        'Minimum Threshold',
        'Status',
        'Lab Location',
        'Last Updated',
      ]

      const rows = itemsResult.docs.map((item: InventoryItem) => {
        const cat = typeof item.category === 'number' ? null : (item.category as InventoryCategory | null)
        return [
          escapeCsvCell(item.id),
          escapeCsvCell(item.name),
          escapeCsvCell(item.sku || 'N/A'),
          escapeCsvCell(cat?.name || 'Uncategorized'),
          escapeCsvCell(item.quantityTotal ?? 0),
          escapeCsvCell(item.quantityAvailable ?? 0),
          escapeCsvCell(item.quantityIssued ?? 0),
          escapeCsvCell(item.minimumStock ?? 0),
          escapeCsvCell(item.status || 'active'),
          escapeCsvCell(item.location || 'N/A'),
          escapeCsvCell(item.updatedAt),
        ].join(',')
      })

      const csvContent = [headers.join(','), ...rows].join('\r\n')

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="robolution-inventory-${today}.csv"`,
        },
      })
    }
  } catch (error: any) {
    console.error('Error generating CSV export:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate CSV export' },
      { status: 500 },
    )
  }
}
