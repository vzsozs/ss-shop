'use server'
import { handleServerFunctions as h } from '@payloadcms/next/layouts'
import config from '../../payload.config'

export async function serverFunction(args: Parameters<typeof h>[0]) {
  return h({
    ...args,
    config,
  })
}
