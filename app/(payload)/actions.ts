'use server'
import { handleServerFunctions as payloadHandleServerFunctions } from '@payloadcms/next/layouts'

export const handleServerFunctions = async (args: any) => {
  return payloadHandleServerFunctions(args)
}
