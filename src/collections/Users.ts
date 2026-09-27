import type { CollectionConfig } from 'payload'
import { isAdmin, isMemberOrAdmin, isSelfOrAdmin } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // Only Admin and Member can access the Admin Dashboard
    admin: ({ req: { user } }) => Boolean(user && (user.role === 'admin' || user.role === 'member')),
    read: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'member') return true
      if (id) return user.id === id
      return false
    },
    create: isAdmin,
    update: isSelfOrAdmin,
    delete: isAdmin,
  },
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'visitor',
      options: [
        { label: 'Visitor', value: 'visitor' },
        { label: 'Intern', value: 'intern' },
        { label: 'Member', value: 'member' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        // Only admins can change roles
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        position: 'sidebar',
        description: 'Controls what this user can do in the inventory system',
      },
    },
  ],
  // hooks removed
}
