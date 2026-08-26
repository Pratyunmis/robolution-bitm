import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    // Check if user is logged in
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

    const { itemId, type, quantity, issuedToEmail, reason } = body

    if (!itemId || !type || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Missing or invalid parameters (itemId, type, quantity > 0 required).' },
        { status: 400 },
      )
    }

    const validTypes = ['issue', 'return', 'restock', 'adjust', 'damage']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `Invalid transaction type: ${type}` }, { status: 400 })
    }

    // If type is issue, resolve issuedTo user
    let issuedToUserId = user.id
    if (type === 'issue') {
      if (issuedToEmail) {
        const usersResult = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: issuedToEmail.trim().toLowerCase(),
            },
          },
          limit: 1,
        })
        if (usersResult.docs.length > 0) {
          issuedToUserId = usersResult.docs[0].id
        }
      }
    }

    // Create transaction in Payload CMS (triggers hooks to update item quantity automatically)
    const transaction = await payload.create({
      collection: 'inventory-transactions',
      data: {
        item: Number(itemId),
        type,
        quantity: Number(quantity),
        issuedTo: type === 'issue' || type === 'return' ? Number(issuedToUserId) : undefined,
        reason: reason || undefined,
      },
      user,
    })

    // Fetch the updated item
    const updatedItem = await payload.findByID({
      collection: 'inventory-items',
      id: Number(itemId),
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      message: `Successfully recorded ${type} transaction.`,
      transaction,
      updatedItem,
    })
  } catch (error: any) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to record transaction.' },
      { status: error?.status || 500 },
    )
  }
}
