import type { CollectionConfig } from 'payload'
import { isAdmin, isInternOrAbove, isMemberOrAdmin } from '../access/roles'

export const InventoryItems: CollectionConfig = {
  slug: 'inventory-items',
  admin: {
    useAsTitle: 'name',
    group: 'Inventory',
    description: 'Individual items and components in the club inventory',
    defaultColumns: ['name', 'category', 'quantityAvailable', 'status'],
  },
  access: {
    read: isInternOrAbove,
    create: isMemberOrAdmin,
    update: isMemberOrAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the item (e.g. Arduino Uno R3)',
      },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: {
        description: 'Optional internal tracking code (e.g. MC-001)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'inventory-categories',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed specifications or notes about the item',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional photo of the item',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Where this item is stored (e.g. Lab Shelf A3)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'quantityTotal',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true, // Managed by transactions
            description: 'Total units owned by the club',
          },
        },
        {
          name: 'quantityAvailable',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true, // Computed via transactions
            description: 'Units currently available in the lab',
          },
        },
        {
          name: 'quantityIssued',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true, // Computed via transactions
            description: 'Units currently checked out to members',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'minimumStock',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Alert threshold for reordering',
          },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'active',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Out of Stock', value: 'out-of-stock' },
            { label: 'Discontinued', value: 'discontinued' },
          ],
          admin: {
            description: 'Automatically managed based on availability',
          },
        },
      ],
    },
    {
      name: 'addedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create') {
          data.addedBy = req.user?.id
        }
        return data
      },
    ],
  },
  timestamps: true,
}
