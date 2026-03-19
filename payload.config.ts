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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    components: {
      graphics: {
        Logo: '/components/Brand/Logo#Logo',
        Icon: '/components/Brand/Icon#Icon',
      },
    },
  },
  collections: [
    Products,
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
