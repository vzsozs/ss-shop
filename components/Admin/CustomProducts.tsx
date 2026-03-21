'use client'

import React, { useEffect, useState } from 'react'
import { Plus, ChevronRight, Trash2, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Sidebar } from './Sidebar'
import { Modal } from './Modal'

interface Product {
  id: string
  name: string
  price: number
  category: {
    name: string
  } | string
  image: {
    url: string
  } | string
  showInSlider: boolean
}

export const CustomProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'confirm' | 'success' | 'error' | 'info'
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=100')
      const data = await response.json()
      setProducts(data.docs)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(products.map(p => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleDelete = async () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }))
    setLoading(true)
    try {
      console.log('Törlés indítása:', selectedIds)
      
      const results = await Promise.all(
        selectedIds.map(async (id) => {
          const res = await fetch(`/api/products/${id}`, { 
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          })
          return { id, ok: res.ok, status: res.status }
        })
      )
      
      console.log('Törlés eredményei:', results)
      const failed = results.filter(r => !r.ok)
      
      if (failed.length > 0) {
        throw new Error(`${failed.length} terméket nem sikerült törölni. (Status: ${failed[0].status})`)
      }

      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)))
      setSelectedIds([])
      setModalConfig({
        isOpen: true,
        title: 'Sikeres törlés',
        message: 'A kijelölt termékeket sikeresen eltávolítottuk.',
        type: 'success'
      })
    } catch (error: unknown) {
      console.error('Hiba a törlés során:', error)
      const message = error instanceof Error ? error.message : 'Ismeretlen hiba történt a törlés során.'
      setModalConfig({
        isOpen: true,
        title: 'Hiba a törlés során',
        message: message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async () => {
    if (!selectedIds.length) return
    setLoading(true)
    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error(`Nem sikerült lekérni a terméket (ID: ${id})`)
        
        const data = await res.json()
        
        // Remove internal fields AND slug (let Payload generate a new one)
        const { id: _id, updatedAt: _u, createdAt: _c, slug: _s, ...rest } = data
        
        // Handle nested objects
        if (typeof rest.category === 'object' && rest.category !== null) {
          rest.category = (rest.category as { id: string }).id
        }
        if (typeof rest.image === 'object' && rest.image !== null) {
          rest.image = (rest.image as { id: string }).id
        }
        
        rest.name = `${rest.name} (másolat)`
        
        // Handle nested array items (features)
        if (Array.isArray(rest.features)) {
          rest.features = rest.features.map((item: Record<string, unknown>) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: _, ...itemRest } = item
            return itemRest
          })
        }
        
        const createRes = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rest),
        })

        if (!createRes.ok) {
          const errData = await createRes.json()
          throw new Error(errData.errors?.[0]?.message || 'Sikertelen mentés')
        }
      }
      await fetchProducts()
      setSelectedIds([])
      setModalConfig({
        isOpen: true,
        title: 'Sikeres duplikálás',
        message: 'A kijelölt termékeket sikeresen lemásoltuk.',
        type: 'success'
      })
    } catch (error: unknown) {
      console.error('Hiba a duplikálás során:', error)
      const message = error instanceof Error ? error.message : 'Ismeretlen hiba történt a duplikálás során.'
      setModalConfig({
        isOpen: true,
        title: 'Hiba a duplikálás során',
        message: message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="custom-view-wrapper">
      <Sidebar />
      
      <main className="custom-admin-main">
        <div className="view-header">
          <div className="view-title">
            <h1>Termékek (Saját)</h1>
          </div>
          <div className="header-actions">
            {selectedIds.length > 0 && (
              <div className="selection-actions">
                <button 
                  className="action-icon-btn delete" 
                  title="Kijelöltek törlése"
                  onClick={() => setModalConfig({
                    isOpen: true,
                    title: 'Biztosan törlöd?',
                    message: `Kijelöltél ${selectedIds.length} terméket. Ez a művelet nem vonható vissza.`,
                    type: 'confirm',
                    onConfirm: handleDelete
                  })}
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  className="action-icon-btn" 
                  title="Kijelöltek duplikálása"
                  onClick={handleDuplicate}
                >
                  <Copy size={20} />
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#775a2b' }}>
                  {selectedIds.length} kijelölve
                </span>
              </div>
            )}
            <Link href="/admin/custom-products/create" className="create-btn">
              <Plus size={20} />
              Új Termék
            </Link>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '5rem', textAlign: 'center', color: '#775a2b', fontSize: '1.5rem', fontWeight: 800 }}>
              Termékek betöltése...
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <div 
                      className={`checkbox-container ${selectedIds.length === products.length ? 'checked' : ''}`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === products.length && <Check size={14} color="white" />}
                    </div>
                  </th>
                  <th style={{ width: '100px' }}>Kép</th>
                  <th>Terméknév</th>
                  <th>Kategória</th>
                  <th>Ár</th>
                  <th>Főoldalon</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr 
                    key={product.id} 
                    className={`product-row ${selectedIds.includes(product.id) ? 'selected' : ''}`}
                  >
                    <td>
                      <div 
                        className={`checkbox-container ${selectedIds.includes(product.id) ? 'checked' : ''}`}
                        onClick={() => toggleSelect(product.id)}
                      >
                        {selectedIds.includes(product.id) && <Check size={14} color="white" />}
                      </div>
                    </td>
                    <td className="img-cell">
                      <div className="img-container">
                        {product.image && typeof product.image === 'object' && product.image.url ? (
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image 
                              src={product.image.url} 
                              alt={product.name} 
                              fill
                              style={{ objectFit: 'cover' }} 
                            />
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                        )}
                      </div>
                    </td>
                    <td className="name-cell">{product.name}</td>
                    <td>
                      <span className="badge-branded">
                        {product.category && typeof product.category === 'object' ? product.category.name : 'Nincs'}
                      </span>
                    </td>
                    <td className="price-cell">
                      {product.price ? `${product.price.toLocaleString()} Ft` : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                        <span className={`status-dot ${product.showInSlider ? 'status-active' : 'status-inactive'}`} />
                        {product.showInSlider ? 'IGEN' : 'NEM'}
                      </div>
                    </td>
                    <td>
                      <Link href={`/admin/custom-products/${product.id}`} className="edit-link">
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
 
       <Modal 
         isOpen={modalConfig.isOpen}
         title={modalConfig.title}
         message={modalConfig.message}
         type={modalConfig.type}
         onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
         onConfirm={modalConfig.onConfirm}
       />
    </div>
  )
}
