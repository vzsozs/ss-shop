import { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Termék',
    plural: 'Termékek',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['image', 'name', 'category', 'showInSlider'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'archived',
      label: 'Archivált (nem választható)',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showInSlider',
      label: 'Megjelenítés a főoldali sliderben',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      label: 'Terméknév (admin/termekek 6)',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug (URL azonosító)',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Automatikusan generálódik a névből, ha üres marad.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const transliterate = (text: string) => {
              const charMap: Record<string, string> = {
                'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o', 'ú': 'u', 'ü': 'u', 'ű': 'u',
                'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ö': 'o', 'Ő': 'o', 'Ú': 'u', 'Ü': 'u', 'Ű': 'u'
              }
              return text.replace(/[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g, match => charMap[match] || match)
            }
            
            const sourceText = value || data?.name || ''
            return transliterate(sourceText)
              .toLowerCase()
              .trim()
              .replace(/ /g, '-')
              .replace(/[^\w-]+/g, '')
          },
        ],
      },
    },
    {
      name: 'description',
      label: 'Leírás (admin/termekek 5)',
      type: 'richText',
      editor: lexicalEditor({
        features: () => [
          BoldFeature(),
          ItalicFeature(),
          LinkFeature({
            enabledCollections: ['products'], // Allow internal links to other products
          }),
        ],
      }),
    },
    {
      name: 'price',
      label: 'Ár (Ft) (admin/termekek 12)',
      type: 'number',
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== 'number' || value <= 0 || !Number.isInteger(value)) {
          return 'Az árnak pozitív egész számnak kell lennie.'
        }
        return true
      },
    },
    {
      name: 'category',
      label: 'Kategória (admin/termekek 13)',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'unit',
      label: 'Kiszerelés (admin/termekek 14)',
      type: 'select',
      required: true,
      defaultValue: 'db',
      options: [
        { label: 'db', value: 'db' },
        { label: 'g', value: 'g' },
        { label: 'dl', value: 'dl' },
      ],
    },
    {
      name: 'features',
      label: 'Tulajdonságok (admin/termekek 15)',
      type: 'array',
      fields: [
        {
          name: 'tulajdonság_neve',
          type: 'text',
          required: true,
        },
        {
          name: 'érték',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      label: 'Termékkép (admin/termekek 4)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath('/')
        revalidatePath(`/termek/${doc.slug}`)
        console.log(`ISR Revalidálás: / és /termek/${doc.slug}`)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePath('/')
        revalidatePath(`/termek/${doc.slug}`)
        console.log(`ISR Revalidálás: / és /termek/${doc.slug}`)
      },
    ],
  },
}
