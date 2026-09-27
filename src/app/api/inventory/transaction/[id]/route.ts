import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { InventoryService, ServiceError } from '@/services/inventory.service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch (_e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const { status } = body

    const { transaction, updatedItem } = await InventoryService.updateTransactionStatus(
      payload,
      user,
      id,
      status,
    )

    return NextResponse.json({
      success: true,
      message: `Transaction ${transaction.status} successfully.`,
      transaction,
      updatedItem,
    })
  } catch (error: any) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update transaction.' },
      { status: error?.status || 500 },
    )
  }
}
