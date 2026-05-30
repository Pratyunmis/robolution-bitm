import type { CollectionConfig } from 'payload'

export const AboutUs: CollectionConfig = {
  slug: 'about-us',
  labels: {
    singular: 'About Us',
    plural: 'About Us',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'About Robolution',
    },
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      defaultValue: 'About Us',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      required: false,
    },
    {
      name: 'mainContent',
      type: 'richText',
      required: true,
    },
    {
      name: 'mission',
      type: 'richText',
      required: false,
    },
    {
      name: 'vision',
      type: 'richText',
      required: false,
    },
    {
      name: 'values',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          required: false,
          admin: {
            description: 'Icon name from lucide-react',
          },
        },
      ],
    },
    {
      name: 'achievements',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'number',
          required: true,
        },
        {
          name: 'suffix',
          type: 'text',
          required: false,
          admin: {
            description: 'e.g., +, K, M',
          },
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'gallery',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
