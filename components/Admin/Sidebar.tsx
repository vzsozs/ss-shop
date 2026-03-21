'use client'

import React from 'react'
import './AdminStyles.scss'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Layers, 
  Image as ImageIcon, 
  Users, 
  Home,
  ChevronRight,
  Tag,
  LayoutGrid,
  Plus
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Logo } from '../Brand/Logo'


export const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const navItems = [
    { label: 'Termékek', slug: 'products', href: '/admin/collections/products', icon: <ShoppingBag size={18} /> },
    { label: 'Termékek (Saját)', slug: 'custom-products', href: '/admin/custom-products', icon: <ShoppingBag size={18} /> },
    { label: 'Kategóriák (Saját)', slug: 'custom-categories', href: '/admin/custom-categories', icon: <Tag size={20} />, quickAdd: '/admin/custom-categories/create' },
    { label: 'Kategóriák', slug: 'categories', href: '/admin/collections/categories', icon: <Layers size={18} /> },
    { label: 'Étlapok', slug: 'home-slider', href: '/admin/collections/slides', icon: <LayoutGrid size={18} /> }, // Modified/added slider link
    { label: 'Média', slug: 'media', href: '/admin/collections/media', icon: <ImageIcon size={18} /> },
    { label: 'Felhasználók', slug: 'users', href: '/admin/collections/users', icon: <Users size={18} /> },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className="custom-nav">
      <div className="nav-container">
        <div className="nav-header">
          <Link href="/admin" className="nav-logo-link">
            <div className="logo-wrapper">
              <Logo width={40} height={40} />
            </div>
          </Link>
          <div className="header-text">
             <h1 className="nav-title">Sajt-Sonka</h1>
             <p className="nav-subtitle">ADMIN PANEL</p>
          </div>
        </div>

        <div className="nav-section">
          <p className="section-label">FŐMENÜ</p>
          <div className="nav-items">
            <Link href="/admin" className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}>
              <div className="icon-box"><Home size={18} /></div>
              <span className="nav-label">Vezérlőpult</span>
              {pathname === '/admin' && <ChevronRight size={14} className="active-indicator" />}
            </Link>

            {navItems.map((item) => (
              <div className="nav-item-wrapper" key={item.slug}>
                <Link
                  href={item.href}
                  className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <div className="icon-box">{item.icon}</div>
                  <span className="nav-label">{item.label}</span>
                  {isActive(item.href) && <ChevronRight size={14} className="active-indicator" />}
                </Link>
                {item.quickAdd && (
                  <Link href={item.quickAdd} className="quick-add-icon-btn" title="Gyors hozzáadás">
                    <Plus size={16} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="nav-footer">
        <div className="user-profile">
            <div className="user-avatar">AD</div>
            <div className="user-info">
                <span className="user-name">Adminisztrátor</span>
                <span className="user-role">Szuperfelhasználó</span>
            </div>
        </div>
        <p className="nav-version">v0.1 | design by zsozs & antigravity</p>
      </div>
    </nav>
  )
}

export default Sidebar
