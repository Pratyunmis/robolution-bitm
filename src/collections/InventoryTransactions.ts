import type { CollectionConfig } from 'payload'
import { isAdmin, isInternOrAbove, isMemberOrAdmin } from '../access/roles'
import { validateTransaction, applyTransaction } from '../lib/inventory/quantity'
import { broadcastInventoryUpdate } from '../lib/events/inventoryBus'
import { APIError } from 'payload'

export const InventoryTransactions: CollectionConfig = {
  slug: 'inventory-transactions',
  admin: {
    useAsTitle: 'type',
    group: 'Inventory',
    description: 'Audit trail of all inventory movements (issue, return, restock, adjust)',
    defaultColumns: ['item', 'type', 'quantity', 'timestamp', 'performedBy'],
  },
  access: {
    read: isInternOrAbove,
    create: isInternOrAbove, // Interns can create pending requests
    update: isMemberOrAdmin, // Members and Admins can approve/reject
    // Transactions form an immutable audit trail
    delete: () => false,
  },
  fields: [
    {
      name: 'item',
      type: 'relationship',
      relationTo: 'inventory-items',
      required: true,
      admin: {
        description: 'The item being transacted',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Issue (Checkout)', value: 'issue' },
        { label: 'Return (Checkin)', value: 'return' },
        { label: 'Restock (New purchase)', value: 'restock' },
        { label: 'Adjust (Correction)', value: 'adjust' },
        { label: 'Damage (Write-off)', value: 'damage' },
      ],
      admin: {
        description: 'Type of transaction',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'completed',
      options: [
        { label: 'Pending Approval', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Workflow status',
      },
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Number of units (must be positive)',
      },
    },
    {
      name: 'issuedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Required if type is Issue. Who is receiving the items?',
        condition: (data) => data.type === 'issue' || data.type === 'return',
      },
    },
    {
      name: 'reason',
      type: 'textarea',
      admin: {
        description: 'Required if type is Adjust. Optional notes for other types.',
      },
    },
    {
      name: 'performedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data) {
          // Cross-field validation: Adjust requires reason
          if (data.type === 'adjust' && !data.reason) {
            throw new APIError('A reason is required when adjusting inventory.', 400)
          }
          // Cross-field validation: Damage requires reason
          if (data.type === 'damage' && !data.reason) {
            throw new APIError('A reason is required when reporting damaged inventory.', 400)
          }
          // Cross-field validation: Issue requires issuedTo
          if (data.type === 'issue' && !data.issuedTo) {
            throw new APIError('An issuedTo user is required when issuing inventory.', 400)
          }
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'create') {
          // Auto-set tracking fields
          data.performedBy = req.user?.id
          data.timestamp = new Date().toISOString()
          
          // Workflow logic: Interns need approval, others auto-complete
          if (req.user?.role === 'intern') {
            data.status = 'pending'
          } else {
            data.status = 'completed'
          }
        } else if (operation === 'update' && originalDoc) {
          // If status changes to completed/approved, record approver
          if (originalDoc.status === 'pending' && (data.status === 'completed' || data.status === 'approved')) {
            data.approvedBy = req.user?.id
          }
        }

        // Apply quantity logic ONLY when status becomes completed
        const isNewlyCompleted = 
          (operation === 'create' && data.status === 'completed') ||
          (operation === 'update' && originalDoc?.status === 'pending' && (data.status === 'completed' || data.status === 'approved'))

        if (isNewlyCompleted) {
          // 1. Fetch the related item
          const item = await req.payload.findByID({
            collection: 'inventory-items',
            id: data.item,
          })

          // 2. Validate the transaction logic
          const validation = validateTransaction(item as any, data.type, data.quantity)
          if (!validation.valid) {
            throw new APIError(validation.error || 'Invalid transaction', 400)
          }

          // 3. Calculate new quantities
          const newQuantities = applyTransaction(item as any, data.type, data.quantity)

          // 4. Update the item document
          await req.payload.update({
            collection: 'inventory-items',
            id: data.item,
            data: newQuantities,
          })
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create' && doc) {
          broadcastInventoryUpdate({
            type: 'TRANSACTION_CREATED',
            timestamp: doc.timestamp || new Date().toISOString(),
            transactionId: doc.id,
            itemId: typeof doc.item === 'object' ? doc.item?.id : doc.item,
            actionType: doc.type,
            quantity: doc.quantity,
          })
        }
      },
    ],
  },
  timestamps: true,
}
