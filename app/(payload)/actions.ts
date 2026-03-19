'use server'
import { handleServerFunctions as h } from '@payloadcms/next/layouts'
import config from '../../payload.config'

export async function serverFunction(args: any) {
  return h({
    ...args,
    config,
  })
}
