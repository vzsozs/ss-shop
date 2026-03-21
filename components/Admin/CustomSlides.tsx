'use client'

import React, { useEffect, useState } from 'react'
import { Plus, ChevronRight, Trash2, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Sidebar } from './Sidebar'
import { Modal } from './Modal'

interface Slide {
  id: string
  name: string
  backgroundImage: {
    url: string
  } | string
  showOnHomepage: boolean
  category: {
    name: string
  } | string
}

export const CustomSlides: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([])
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

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/menu-slides?limit=100')
      const data = await response.json()
      setSlides(data.docs)
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const toggleSelectAll = () => {
    if (selectedIds.length === slides.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(slides.map(s => s.id))
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
        selectedIds.map(id => fetch(`/api/menu-slides/${id}`, { method: 'DELETE' }))
      )
      
      const allOk = results.every(res => res.ok)
      if (!allOk) {
        throw new Error('Néhány étlapot nem sikerült törölni. Ellenőrizd a jogosultságokat!')
      }

      setSlides(prev => prev.filter(s => !selectedIds.includes(s.id)))
      setSelectedIds([])
      setModalConfig({
        isOpen: true,
        title: 'Sikeres törlés',
        message: 'A kijelölt étlapokat sikeresen eltávolítottuk.',
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
        const res = await fetch(`/api/menu-slides/${id}`)
        if (!res.ok) throw new Error(`Nem sikerült lekérni a diát (ID: ${id})`)
        
        const data = await res.json()
        
        // Remove internal fields
        const rest = { ...data };
        delete (rest as Record<string, unknown>).id;
        delete (rest as Record<string, unknown>).updatedAt;
        delete (rest as Record<string, unknown>).createdAt;
        
        // Handle nested image
        if (typeof rest.backgroundImage === 'object' && rest.backgroundImage !== null) {
          rest.backgroundImage = (rest.backgroundImage as { id: string }).id
        }
        
        rest.name = `${rest.name} (másolat)`
        
        // Handle nested array items (prices)
        if (Array.isArray(rest.prices)) {
          rest.prices = rest.prices.map((item: Record<string, unknown>) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: _, ...itemRest } = item
            return itemRest
          })
        }
        
        const createRes = await fetch('/api/menu-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rest),
        })

        if (!createRes.ok) {
          const errData = await createRes.json()
          throw new Error(errData.errors?.[0]?.message || 'Sikertelen mentés')
        }
      }
      await fetchSlides()
      setSelectedIds([])
      setModalConfig({
        isOpen: true,
        title: 'Sikeres duplikálás',
        message: 'A kijelölt étlapokat sikeresen lemásoltuk.',
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

  return (
    <div className="custom-view-wrapper">
      <Sidebar />
      
      <main className="custom-admin-main">
        <div className="view-header">
          <div className="view-title">
            <h1>Étlapok (Saját)</h1>
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
                     message: `Kijelöltél ${selectedIds.length} étlapot. Ez a művelet nem vonható vissza.`,
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
            href="/admin/custom-slides/create"
            className="add-new-btn"
          >
            <Plus size={18} />
            Új étlap hozzáadása
          </Link>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '5rem', textAlign: 'center', color: '#775a2b', fontSize: '1.5rem', fontWeight: 800 }}>
              Étlapok betöltése...
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <div 
                      className={`checkbox-container ${selectedIds.length === slides.length ? 'checked' : ''}`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === slides.length && <Check size={14} color="white" />}
                    </div>
                  </th>
                  <th style={{ width: '100px' }}>Háttérkép</th>
                  <th>Étlap neve</th>
                  <th>Kategória</th>
                  <th>Főoldalon</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {slides.map((slide) => (
                  <tr 
                    key={slide.id} 
                    className={`category-row ${selectedIds.includes(slide.id) ? 'selected' : ''}`}
                  >
                    <td>
                      <div 
                        className={`checkbox-container ${selectedIds.includes(slide.id) ? 'checked' : ''}`}
                        onClick={() => toggleSelect(slide.id)}
                      >
                        {selectedIds.includes(slide.id) && <Check size={14} color="white" />}
                      </div>
                    </td>
                    <td className="img-cell">
                      <div className="img-container">
                        {slide.backgroundImage && typeof slide.backgroundImage === 'object' && slide.backgroundImage.url ? (
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image 
                              src={slide.backgroundImage.url} 
                              alt={slide.name} 
                              fill
                              style={{ objectFit: 'cover' }} 
                            />
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                        )}
                      </div>
                    </td>
                    <td className="name-cell">{slide.name}</td>
                    <td>
                      <span className="badge-branded">
                        {slide.category && typeof slide.category === 'object' ? slide.category.name : 'Válassz!'}
                      </span>
                    </td>
                    <td>
                      <div className={`badge-active ${slide.showOnHomepage ? 'active' : ''}`}>
                         {slide.showOnHomepage ? 'Igen' : 'Nem'}
                      </div>
                    </td>
                    <td>
                      <Link 
                        href={`/admin/custom-slides/${slide.id}`}
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
