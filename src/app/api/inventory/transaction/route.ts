import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { InventoryService, ServiceError } from '@/services/inventory.service'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to record inventory transactions.' },
        { status: 401 },
      )
    }

    let body
    try {
      body = await request.json()
    } catch (_e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const { transaction, updatedItem } = await InventoryService.createTransaction(
      payload,
      user,
      body,
    )

    return NextResponse.json({
      success: true,
      message: `Successfully recorded ${body.type} transaction.`,
      transaction,
      updatedItem,
    })
  } catch (error: any) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to record transaction.' },
      { status: error?.status || 500 },
    )
  }
}
