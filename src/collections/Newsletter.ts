import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'active'],
    description: 'Newsletter subscription emails',
  },
  access: {
    // Only admins can view subscriber emails (PII).
    read: isAdmin,
    create: () => true, // Public subscribe form
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email Address',
      admin: {
        description: 'Subscriber email address',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active Subscription',
      admin: {
        description: 'Whether the subscription is active',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date().toISOString(),
      label: 'Subscribed At',
    },
  ],
  timestamps: true,
}
