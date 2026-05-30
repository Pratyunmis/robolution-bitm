import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'year', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., President, Vice President, Technical Head, etc.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'President', value: 'president' },
        { label: 'Vice President', value: 'vice_president' },
        { label: 'Joint President', value: 'joint_president' },
        { label: 'Captain', value: 'captain' },
        { label: 'Vice Captain', value: 'vice_captain' },
        { label: 'General Secretary', value: 'general_secretary' },
        { label: 'Joint Secretary', value: 'joint_secretary' },
        { label: 'Design Lead', value: 'design_lead' },
        { label: 'Treasurer', value: 'treasurer' },
        { label: 'Embedded Head', value: 'embedded_head' },
        { label: 'Mechanical Head', value: 'mechanical_head' },
        { label: 'Management Lead', value: 'management_lead' },
        { label: 'Web Master', value: 'web_master' },
        { label: 'Intelligence Head ', value: 'intelligence_head' },
        { label: 'Public Relations Head', value: 'public_relations_head' },
      ],
      defaultValue: 'president',
    },
    {
      name: 'year',
      type: 'select',
      required: false,
      options: [
        { label: '1st Year', value: '1' },
        { label: '2nd Year', value: '2' },
        { label: '3rd Year', value: '3' },
        { label: '4th Year', value: '4' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: false,
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'email',
          type: 'text',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
  ],
}
