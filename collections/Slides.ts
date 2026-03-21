import { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Slides: CollectionConfig = {
  slug: 'menu-slides',
  labels: {
    singular: 'Étlap',
    plural: 'Étlapok',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category'],
  },
  fields: [
    {
      name: 'name',
      label: 'Étlap neve (admin/etlapok 7)',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Alcím / Leírás (admin/etlapok 8)',
      type: 'textarea',
      required: true,
    },
    {
      name: 'backgroundImage',
      label: 'Háttérkép',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      label: 'Kategória',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'showOnHomepage',
      label: 'Főoldalon megjelenik',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'prices',
      label: 'Árak / Tételek',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Tétel neve (admin/etlapok 9)',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          label: 'Ár (admin/etlapok 10)',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Részletek (admin/etlapok 11)',
          type: 'textarea',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/')
        console.log('Adatfrissítés: ISR revalidálás elindítva a főoldalon (/)')
      },
    ],
    afterDelete: [
      () => {
        revalidatePath('/')
        console.log('Adattörlés: ISR revalidálás elindítva a főoldalon (/)')
      },
    ],
  },
}
