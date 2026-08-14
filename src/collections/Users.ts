import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'intern',
      options: [
        { label: 'Intern', value: 'intern' },
        { label: 'Member', value: 'member' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        // Temporarily allow anyone to update roles so the first user can make themselves an admin
        update: () => true,
      },
      admin: {
        position: 'sidebar',
        description: 'Controls what this user can do in the inventory system',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-assign admin role to the very first user (initial setup)
        if (operation === 'create') {
          const { payload } = req
          const existingUsers = await payload.find({
            collection: 'users',
            limit: 1,
          })
          if (existingUsers.totalDocs === 0) {
            data.role = 'admin'
          }
        }
        return data
      },
    ],
  },
}
