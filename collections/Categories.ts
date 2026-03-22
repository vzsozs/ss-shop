import { CollectionConfig, APIError } from 'payload'

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
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
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
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        const categoryId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id
        console.log(`Törlés előtti ellenőrzés - ID: ${id} (típus: ${typeof id}), konvertált ID: ${categoryId}`)
        
        const products = await req.payload.find({
          collection: 'products',
          where: {
            category: {
              equals: categoryId,
            },
          },
          limit: 1,
        })

        if (products.totalDocs > 0) {
          console.log(`Törlés megtagadva: kategóriában ${products.totalDocs} termék van.`)
          throw new APIError('Ez a kategória nem törölhető, mert még vannak hozzárendelt termékek! Előbb töröld vagy helyezd át a hozzá tartozó termékeket.', 400)
        }

        const slides = await req.payload.find({
          collection: 'menu-slides',
          where: {
            category: {
              equals: categoryId,
            },
          },
          limit: 1,
        })

        if (slides.totalDocs > 0) {
          console.log(`Törlés megtagadva: kategóriában ${slides.totalDocs} étlap van.`)
          throw new APIError('Ez a kategória nem törölhető, mert még vannak hozzárendelt étlapokat! Előbb töröld vagy helyezd át a hozzá tartozó étlapokat.', 400)
        }
        
        console.log('Törlés engedélyezve (nincs függőség).')
      },
    ],
  },
}
