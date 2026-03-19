import { CollectionConfig } from 'payload'

export const Slides: CollectionConfig = {
  slug: 'slides',
  labels: {
    singular: 'Dia',
    plural: 'Diák',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Név',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Leírás',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      label: 'Kép',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      label: 'Kategória',
      type: 'text',
      required: true,
    },
    {
      name: 'layoutType',
      label: 'Elrendezés típusa',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Hero kártya',
          value: 'hero-card',
        },
        {
          label: 'Árlista',
          value: 'price-list',
        },
      ],
    },
    {
      name: 'prices',
      label: 'Árak',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Név',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          label: 'Ár',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Leírás',
          type: 'textarea',
        },
      ],
      admin: {
        condition: (data) => data?.layoutType === 'price-list',
      },
    },
  ],
}
