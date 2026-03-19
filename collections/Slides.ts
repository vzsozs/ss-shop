import { CollectionConfig } from 'payload'

export const Slides: CollectionConfig = {
  slug: 'slides',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'layoutType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Hero Card',
          value: 'hero-card',
        },
        {
          label: 'Price List',
          value: 'price-list',
        },
      ],
    },
    {
      name: 'prices',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        condition: (data) => data?.layoutType === 'price-list',
      },
    },
  ],
}
