import React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import { serverFunction } from './actions'
import { Rokkitt } from 'next/font/google'
import config from '../../payload.config'
import { importMap } from './admin/importMap'
import '@payloadcms/next/css'
import './custom.scss'

const rokkitt = Rokkitt({
  subsets: ['latin'],
  variable: '--font-rokkitt',
})

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout 
    config={config} 
    importMap={importMap} 
    serverFunction={serverFunction as any}
  >
    <div className={`${rokkitt.variable} font-rokkitt`}>
      {children}
    </div>
  </RootLayout>
)

export default Layout
