/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BY HAND. */
import { NotFoundPage } from '@payloadcms/next/views'
import config from '../../../../payload.config'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

const NotFound = ({ params, searchParams }: Args) => NotFoundPage({ config, params, searchParams })

export default NotFound
