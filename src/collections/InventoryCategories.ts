import type { CollectionConfig } from 'payload'
import { isAdmin, isInternOrAbove } from '../access/roles'

export const InventoryCategories: CollectionConfig = {
  slug: 'inventory-categories',
  admin: {
    useAsTitle: 'name',
    group: 'Inventory',
    description: 'Categories for organizing inventory items',
  },
  access: {
    read: isInternOrAbove,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Name of the category (e.g. Sensors, Motors)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of what belongs in this category',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional category icon or photo',
      },
    },
  ],
  timestamps: true,
}
