import type { Payload } from 'payload'
import type { User, InventoryItem, InventoryCategory, InventoryTransaction, Media } from '@/payload-types'
import type {
  InventoryItemDTO,
  DetailedInventoryItemDTO,
  InventoryCategoryDTO,
  InventoryStatsDTO,
  InventoryTransactionDTO,
  TransactionType,
  TransactionStatus,
} from '@/types/inventory'
import { renderLexical } from '@/lib/lexicalToHtml'

export interface CreateTransactionInput {
  itemId: number | string
  type: TransactionType
  quantity: number
  issuedToEmail?: string
  reason?: string
}

export class ServiceError extends Error {
  statusCode: number
  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'ServiceError'
    this.statusCode = statusCode
  }
}

/**
 * Service encapsulating all Inventory domain data access and business logic.
 * Adheres to SRP by abstracting database queries away from controllers and server pages.
 */
export class InventoryService {
  /**
   * Fetches full inventory catalog, categories, and calculated stock metrics.
   */
  static async getInventoryCatalog(payload: Payload): Promise<{
    items: InventoryItemDTO[]
    categories: InventoryCategoryDTO[]
    stats: InventoryStatsDTO
  }> {
    const [categoriesResult, itemsResult] = await Promise.all([
      payload.find({
        collection: 'inventory-categories',
        limit: 100,
        sort: 'name',
      }),
      payload.find({
        collection: 'inventory-items',
        limit: 200,
        depth: 2,
        sort: 'name',
      }),
    ])

    const categories: InventoryCategoryDTO[] = categoriesResult.docs.map((cat: InventoryCategory) => {
      const img = typeof cat.image === 'number' ? null : (cat.image as Media | null)
      return {
        id: cat.id.toString(),
        name: cat.name,
        description: cat.description || undefined,
        imageUrl: img?.url || undefined,
      }
    })

    let totalUnits = 0
    let totalAvailable = 0
    let totalIssued = 0
    let lowStockCount = 0
    let outOfStockCount = 0

    const items: InventoryItemDTO[] = itemsResult.docs.map((item: InventoryItem) => {
      let imgUrl: string | undefined = undefined
      if (item.image && typeof item.image === 'object' && 'url' in item.image && item.image.url) {
        imgUrl = item.image.url
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

    const stats: InventoryStatsDTO = {
      totalItems: items.length,
      totalUnits,
      totalAvailable,
      totalIssued,
      lowStockCount,
      outOfStockCount,
    }

    return { items, categories, stats }
  }

  /**
   * Fetches detailed item with its rendered rich text description and recent transactions.
   */
  static async getItemDetails(
    payload: Payload,
    itemId: number,
  ): Promise<{
    item: DetailedInventoryItemDTO
    transactions: InventoryTransactionDTO[]
    descriptionHtml: string
  } | null> {
    const rawItem = await payload.findByID({
      collection: 'inventory-items',
      id: itemId,
      depth: 2,
    })

    if (!rawItem) return null

    const rawTransactions = await payload.find({
      collection: 'inventory-transactions',
      where: {
        item: {
          equals: itemId,
        },
      },
      sort: '-timestamp',
      limit: 50,
      depth: 2,
    })

    let descriptionHtml = ''
    if (rawItem.description) {
      descriptionHtml = await renderLexical(rawItem.description)
    }

    let imgUrl: string | undefined = undefined
    if (rawItem.image && typeof rawItem.image === 'object' && 'url' in rawItem.image && rawItem.image.url) {
      imgUrl = rawItem.image.url
    }

    const cat = typeof rawItem.category === 'number' ? null : (rawItem.category as InventoryCategory | null)

    const item: DetailedInventoryItemDTO = {
      id: rawItem.id.toString(),
      name: rawItem.name,
      sku: rawItem.sku || undefined,
      category: {
        id: cat?.id ? cat.id.toString() : (typeof rawItem.category === 'number' ? rawItem.category.toString() : ''),
        name: cat?.name || 'Uncategorized',
      },
      imageUrl: imgUrl,
      location: rawItem.location || undefined,
      quantityTotal: rawItem.quantityTotal ?? 0,
      quantityAvailable: rawItem.quantityAvailable ?? 0,
      quantityIssued: rawItem.quantityIssued ?? 0,
      minimumStock: rawItem.minimumStock ?? 0,
      status: rawItem.status || ((rawItem.quantityAvailable ?? 0) <= 0 ? 'out-of-stock' : 'active'),
      updatedAt: rawItem.updatedAt,
      createdAt: rawItem.createdAt,
      descriptionHtml,
    }

    const transactions: InventoryTransactionDTO[] = rawTransactions.docs.map((tx: InventoryTransaction) => {
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
    })

    return { item, transactions, descriptionHtml }
  }

  /**
   * Fetches global transaction audit trail.
   */
  static async getAuditTransactions(payload: Payload, limit = 200): Promise<InventoryTransactionDTO[]> {
    const transactionsResult = await payload.find({
      collection: 'inventory-transactions',
      limit,
      depth: 2,
      sort: '-timestamp',
    })

    return transactionsResult.docs.map((tx: InventoryTransaction) => {
      const item = typeof tx.item === 'number' ? null : (tx.item as InventoryItem | null)
      const performer = typeof tx.performedBy === 'number' ? null : (tx.performedBy as User | null)
      const recipient = typeof tx.issuedTo === 'number' ? null : (tx.issuedTo as User | null)

      return {
        id: tx.id.toString(),
        type: tx.type,
        quantity: tx.quantity,
        reason: tx.reason || undefined,
        timestamp: tx.timestamp || tx.createdAt,
        item: {
          id: item ? item.id.toString() : (typeof tx.item === 'number' ? tx.item.toString() : ''),
          name: item?.name || 'Unknown Item',
          sku: item?.sku || undefined,
        },
        performedBy: performer ? { id: performer.id.toString(), email: performer.email } : undefined,
        issuedTo: recipient ? { id: recipient.id.toString(), email: recipient.email } : undefined,
        status: tx.status,
      }
    })
  }

  /**
   * Records a new transaction (checkout, return, restock, damage, adjust).
   */
  static async createTransaction(
    payload: Payload,
    user: User,
    input: CreateTransactionInput,
  ): Promise<{ transaction: InventoryTransaction; updatedItem: InventoryItem }> {
    const { itemId, type, quantity, issuedToEmail, reason } = input

    if (!itemId || !type || !quantity || quantity <= 0) {
      throw new ServiceError('Missing or invalid parameters (itemId, type, quantity > 0 required).', 400)
    }

    const validTypes: TransactionType[] = ['issue', 'return', 'restock', 'adjust', 'damage']
    if (!validTypes.includes(type)) {
      throw new ServiceError(`Invalid transaction type: ${type}`, 400)
    }

    let issuedToUserId: number | string = user.id

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
        } else {
          throw new ServiceError(`No user found with email ${issuedToEmail}`, 400)
        }
      }
    }

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

    const updatedItem = await payload.findByID({
      collection: 'inventory-items',
      id: Number(itemId),
      depth: 1,
    })

    return { transaction, updatedItem }
  }

  /**
   * Updates status of a pending transaction (approve / reject).
   */
  static async updateTransactionStatus(
    payload: Payload,
    user: User,
    transactionId: number | string,
    status: TransactionStatus,
  ): Promise<{ transaction: InventoryTransaction; updatedItem: InventoryItem }> {
    if (user.role !== 'admin' && user.role !== 'member') {
      throw new ServiceError('Unauthorized to approve or reject transactions.', 403)
    }

    if (status !== 'approved' && status !== 'completed' && status !== 'rejected') {
      throw new ServiceError('Invalid status for update', 400)
    }

    const finalStatus = status === 'approved' ? 'completed' : status

    const transaction = await payload.update({
      collection: 'inventory-transactions',
      id: Number(transactionId),
      data: {
        status: finalStatus,
      },
      user,
    })

    const updatedItem = await payload.findByID({
      collection: 'inventory-items',
      id: typeof transaction.item === 'object' ? transaction.item.id : transaction.item,
      depth: 1,
    })

    return { transaction, updatedItem }
  }
}
