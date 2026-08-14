import type { CollectionConfig } from 'payload'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'active'],
    description: 'Newsletter subscription emails',
  },
  access: {
    // Only admins can view subscriber emails (PII).
    // Fallback: users without a role field (pre-migration) are treated as admin.
    read: ({ req: { user } }) => {
      if (!user) return false
      return !user.role || user.role === 'admin'
    },
    create: () => true, // Public subscribe form
    update: ({ req: { user } }) => {
      if (!user) return false
      return !user.role || user.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return !user.role || user.role === 'admin'
    },
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
