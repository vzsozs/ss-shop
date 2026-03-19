import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Kategória',
    plural: 'Kategóriák',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'ctaType'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Kategória neve (admin/kategoriak 0)',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      label: 'Rövid leírás (admin/kategoriak 2)',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      label: 'Kategória képe (admin/kategoriak 1)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'ctaType',
      label: 'CTA Gomb Típusa (admin/kategoriak 3)',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'Nincs gomb', value: 'none' },
        { label: 'Szendvicsek (Rendelés)', value: 'order' },
        { label: 'Itallap', value: 'drink' },
        { label: 'Kapcsolat', value: 'contact' },
      ],
      required: true,
    },
  ],
}
