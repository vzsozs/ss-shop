import React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import { handleServerFunctions } from './actions'
import config from '../../payload.config'
import { importMap } from './admin/importMap'
import '@payloadcms/next/css'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout 
    config={config} 
    importMap={importMap} 
    serverFunction={handleServerFunctions}
  >
    {children}
  </RootLayout>
)

export default Layout
