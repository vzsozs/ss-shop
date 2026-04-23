'use client'

import React, { useState } from 'react'
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
  Plus,
  Menu,
  X
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from '../Brand/Logo'


export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  React.useEffect(() => {
    // Don't check auth or redirect if we are on the login page
    if (pathname === '/admin/login') return

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me', {
          credentials: 'include'
        })
        const data = await res.json()
        if (!data.user) {
          window.location.href = '/admin/login'
        } else {
          setUser(data.user)
        }
      } catch (err) {
        console.error('Auth check error:', err)
        // Only redirect if not already on login page
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login'
        }
      }
    }
    checkAuth()
  }, [pathname])

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  const navItems = [
    //{ label: 'Termékek', slug: 'products', href: '/admin/collections/products', icon: <ShoppingBag size={18} /> },
    { label: 'Termékek', slug: 'custom-products', href: '/admin/custom-products', icon: <ShoppingBag size={18} /> , quickAdd: '/admin/custom-products/create' },
    { label: 'Kategóriák', slug: 'custom-categories', href: '/admin/custom-categories', icon: <Tag size={20} />, quickAdd: '/admin/custom-categories/create' },
    //{ label: 'Kategóriák', slug: 'categories', href: '/admin/collections/categories', icon: <Layers size={18} /> },
    { label: 'Étlapok', slug: 'menu-slides', href: '/admin/custom-slides', icon: <LayoutGrid size={18} />, quickAdd: '/admin/custom-slides/create' }, // Modified/added slider link
    //{ label: 'Média', slug: 'media', href: '/admin/collections/media', icon: <ImageIcon size={18} /> },
    { label: 'Felhasználók', slug: 'users', href: '/admin/custom-users', icon: <Users size={18} /> },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <nav className={`custom-nav ${isOpen ? 'open' : ''}`}>
        <div className="nav-container">
          <div className="nav-header">
            <Link href="/admin" className="nav-logo-link" onClick={closeSidebar}>
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
            {/*<p className="section-label">FŐMENÜ</p>*/}
            <div className="nav-items">
              {/*<Link href="/admin" className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}>
                <div className="icon-box"><Home size={18} /></div>
                <span className="nav-label">Vezérlőpult</span>
                {pathname === '/admin' && <ChevronRight size={14} className="active-indicator" />}
              </Link>*/}

              {navItems.map((item) => (
                <div className="nav-item-wrapper" key={item.slug}>
                  <Link
                    href={item.href}
                    className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                    onClick={closeSidebar}
                  >
                    <div className="icon-box">{item.icon}</div>
                    <span className="nav-label">{item.label}</span>
                    {isActive(item.href) && <ChevronRight size={14} className="active-indicator" />}
                  </Link>
                  {item.quickAdd && (
                    <Link href={item.quickAdd} className="quick-add-icon-btn" title="Gyors hozzáadás" onClick={closeSidebar}>
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
              <div className="user-avatar">{user?.email?.[0]?.toUpperCase() || 'A'}</div>
              <div className="user-info">
                  <span className="user-name">{user?.email || 'Betöltés...'}</span>
                  <span className="user-role">Bejelentkezve</span>
              </div>
          </div>
          <p className="nav-version">v0.1 | design by zsozs & antigravity</p>
        </div>
      </nav>
    </>
  )
}

export default Sidebar
