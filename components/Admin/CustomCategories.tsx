'use client'

import React, { useEffect, useState } from 'react'
import { Plus, ChevronRight, Trash2, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { Sidebar } from './Sidebar'
import { Modal } from './Modal'

interface Category {
  id: string
  name: string
  image: {
    url: string
  } | string
  ctaType: string
}

export const CustomCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?limit=100')
      const data = await response.json()
      setCategories(data.docs)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const toggleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(categories.map(c => c.id))
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
      const results = await Promise.all(
        selectedIds.map(id => fetch(`/api/categories/${id}`, { method: 'DELETE' }))
      )
      
      const allOk = results.every(res => res.ok)
      if (!allOk) {
        throw new Error('Néhány kategóriát nem sikerült törölni. Ellenőrizd a jogosultságokat!')
      }

      setCategories(prev => prev.filter(c => !selectedIds.includes(c.id)))
      setSelectedIds([])
      setModalConfig({
        isOpen: true,
        title: 'Sikeres törlés',
        message: 'A kijelölt kategóriákat sikeresen eltávolítottuk.',
        type: 'success'
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ismeretlen hiba'
      console.error('Hiba a törlés során:', error)
      setModalConfig({
        isOpen: true,
        title: 'Hiba a törlés során',
        message: message || 'Ismeretlen hiba történt a törlés során.',
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
        const res = await fetch(`/api/categories/${id}`)
        if (!res.ok) throw new Error(`Nem sikerült lekérni a kategóriát (ID: ${id})`)
        
        const data = await res.json()
        
        // Remove internal fields
        const rest = { ...data };
        delete (rest as Record<string, unknown>).id;
        delete (rest as Record<string, unknown>).updatedAt;
        delete (rest as Record<string, unknown>).createdAt;
        
        // Handle nested image
        if (typeof rest.image === 'object' && rest.image !== null) {
          rest.image = (rest.image as { id: string }).id
        }
        
        rest.name = `${rest.name} (másolat)`
        
        const createRes = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rest),
        })

        if (!createRes.ok) {
          const errData = await createRes.json()
          throw new Error(errData.errors?.[0]?.message || 'Sikertelen mentés')
        }
      }
      await fetchCategories()
      setSelectedIds([])
      setModalConfig({
        isOpen: true,
        title: 'Sikeres duplikálás',
        message: 'A kijelölt kategóriákat sikeresen lemásoltuk.',
        type: 'success'
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ismeretlen hiba'
      console.error('Hiba a duplikálás során:', error)
      setModalConfig({
        isOpen: true,
        title: 'Hiba a duplikálás során',
        message: message || 'Ismeretlen hiba történt a duplikálás során.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getCtaLabel = (type: string) => {
    switch (type) {
      case 'order': return 'Rendelés'
      case 'drink': return 'Itallap'
      case 'contact': return 'Kapcsolat'
      default: return 'Nincs'
    }
  }

  return (
    <div className="custom-view-wrapper">
      <Sidebar />
      
      <main className="custom-admin-main">
        <div className="view-header">
          <div className="view-title">
            <h1>Kategóriák (Saját)</h1>
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
                     message: `Kijelöltél ${selectedIds.length} kategóriát. Ez a művelet nem vonható vissza.`,
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
            <Link 
            href="/admin/custom-categories/create"
            className="add-new-btn"
          >
            <Plus size={18} />
            Kategória hozzáadása
          </Link>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '5rem', textAlign: 'center', color: '#775a2b', fontSize: '1.5rem', fontWeight: 800 }}>
              Kategóriák betöltése...
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <div 
                      className={`checkbox-container ${selectedIds.length === categories.length ? 'checked' : ''}`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === categories.length && <Check size={14} color="white" />}
                    </div>
                  </th>
                  <th style={{ width: '100px' }}>Kép</th>
                  <th>Kategória név</th>
                  <th>CTA Gomb</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr 
                    key={category.id} 
                    className={`category-row ${selectedIds.includes(category.id) ? 'selected' : ''}`}
                  >
                    <td>
                      <div 
                        className={`checkbox-container ${selectedIds.includes(category.id) ? 'checked' : ''}`}
                        onClick={() => toggleSelect(category.id)}
                      >
                        {selectedIds.includes(category.id) && <Check size={14} color="white" />}
                      </div>
                    </td>
                    <td className="img-cell">
                      <div className="img-container">
                        {category.image && typeof category.image === 'object' && category.image.url ? (
                          <img 
                            src={category.image.url} 
                            alt="" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                        )}
                      </div>
                    </td>
                    <td className="name-cell">{category.name}</td>
                    <td>
                      <span className="badge-branded">
                        {getCtaLabel(category.ctaType)}
                      </span>
                    </td>
                    <td>
                      <Link 
                        href={`/admin/custom-categories/${category.id}`}
                        className="action-btn-circle"
                        title="Szerkesztés"
                      >
                        <ChevronRight size={18} />
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
