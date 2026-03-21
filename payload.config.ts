import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { hu } from '@payloadcms/translations/languages/hu'

import { Slides } from './collections/Slides'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    components: {
      Nav: './components/Admin/Sidebar#Sidebar',
      graphics: {
        Logo: './components/Brand/Logo#Logo',
        Icon: './components/Brand/Icon#Icon',
      },
      views: {
        CustomProducts: {
          Component: './components/Admin/CustomProducts#CustomProducts',
          path: '/custom-products',
        },
        'custom-categories': {
          Component: './components/Admin/CustomCategories#CustomCategories',
          path: '/custom-categories',
        },
        'custom-category-edit': {
          Component: './components/Admin/CategoryEditView#CategoryEditView',
          path: '/custom-categories/:id',
        },
        'custom-product-edit': {
          Component: './components/Admin/ProductEditView#ProductEditView',
          path: '/custom-products/:id',
        },
      },
    },
  },
  collections: [
    Products,
    Categories,
    Slides,
    Media,
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts'),
  },
  i18n: {
    supportedLanguages: { hu },
  },
})
// Last update: 03/21/2026 05:58:04