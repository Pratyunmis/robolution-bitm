import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || (user.role !== 'admin' && user.role !== 'member')) {
      return NextResponse.json(
        { error: 'Unauthorized to approve or reject transactions.' },
        { status: 403 },
      )
    }

    let body
    try {
      body = await request.json()
    } catch (_e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const { status } = body

    if (status !== 'approved' && status !== 'completed' && status !== 'rejected') {
      return NextResponse.json({ error: 'Invalid status for update' }, { status: 400 })
    }

    // Determine the status to set. Both approved and completed effectively do the same in beforeChange
    const finalStatus = status === 'approved' ? 'completed' : status

    // Update the transaction
    const transaction = await payload.update({
      collection: 'inventory-transactions',
      id: Number(id),
      data: {
        status: finalStatus,
      },
      user,
    })

    // Fetch the updated item to return to the client
    const updatedItem = await payload.findByID({
      collection: 'inventory-items',
      id: typeof transaction.item === 'object' ? transaction.item.id : transaction.item,
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      message: `Transaction ${finalStatus} successfully.`,
      transaction,
      updatedItem,
    })
  } catch (error: any) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update transaction.' },
      { status: error?.status || 500 },
    )
  }
}
