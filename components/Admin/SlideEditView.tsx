'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, Save, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Sidebar } from './Sidebar'
import { Modal } from './Modal'

interface Slide {
  id: string
  name: string
  description: string
  backgroundImage: {
    id: string
    url: string
  } | string | null
  category: string | { id: string, name: string }
  showOnHomepage: boolean
  prices: { name: string, price: string, description?: string }[]
}

interface Category {
  id: string
  name: string
}

export const SlideEditView: React.FC<{ params: { id: string } }> = (props) => {
  const router = useRouter()
  
  // Robust ID extraction
  let id = props.params?.id
  if (!id && typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    if (lastSegment && lastSegment !== 'custom-slides') {
      id = lastSegment
    }
  }

  const [slide, setSlide] = useState<Slide | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
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

  const isNew = !id || id === 'create'

  const fetchSlide = useCallback(async () => {
    try {
      // Fetch categories for the dropdown
      const catRes = await fetch('/api/categories?limit=100')
      if (catRes.ok) {
        const catData = await catRes.json()
        setCategories(catData.docs || [])
      }

      if (isNew) {
        setSlide({
          id: '',
          name: '',
          description: '',
          backgroundImage: null,
          category: '',
          showOnHomepage: true,
          prices: []
        })
        setLoading(false)
        return
      }

      const res = await fetch(`/api/menu-slides/${id}`)
      if (!res.ok) throw new Error('Nem sikerült betölteni az étlapot')
      const data = await res.json()
      setSlide(data)
    } catch (err) {
      console.error('Hiba a betöltés során:', err)
      setModalConfig({
        isOpen: true,
        title: 'Hiba a betöltés során',
        message: err instanceof Error ? err.message : 'Ismeretlen hiba történt',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [id, isNew])

  useEffect(() => {
    fetchSlide()
  }, [fetchSlide])

  const handleSave = async () => {
    if (!slide) return
    setSaving(true)
    try {
      const url = isNew ? '/api/menu-slides' : `/api/menu-slides/${id}`
      const method = isNew ? 'POST' : 'PATCH'
      
      const submitData: Record<string, unknown> = { ...slide }
      if (isNew) delete submitData.id

      // Robust ID extraction for relationships
      const getID = (val: unknown): string | number | null => {
        if (val === undefined || val === null || val === '') return null
        let id: string | number | null = null
        if (typeof val === 'string' || typeof val === 'number') {
          id = val
        } else if (typeof val === 'object') {
          const v = val as { id?: string | number, _id?: string | number }
          id = v.id || v._id || null
        }
        if (id !== null && typeof id === 'string') {
          const num = Number(id)
          return isNaN(num) || id === '' ? id : num
        }
        return id
      }

      submitData.category = getID(slide.category)
      submitData.backgroundImage = getID(slide.backgroundImage)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.errors?.[0]?.message || 'Sikertelen mentés')
      }

      setModalConfig({
        isOpen: true,
        title: 'Sikeres mentés',
        message: 'Az étlap adatai sikeresen frissítésre kerültek.',
        type: 'success',
        onConfirm: () => router.push('/admin/custom-slides')
      })
    } catch (error: unknown) {
      console.error('Mentési hiba:', error)
      const message = error instanceof Error ? error.message : 'Ismeretlen hiba történt.'
      setModalConfig({
        isOpen: true,
        title: 'Hiba a mentés során',
        message: message,
        type: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', slide?.name || 'Slide Image')

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Sikertelen képfeltöltés')
      const media = await res.json()
      setSlide(prev => prev ? { ...prev, backgroundImage: media.doc } : null)
    } catch (err: unknown) {
      console.error('Képfeltöltési hiba:', err)
      setModalConfig({
        isOpen: true,
        title: 'Feltöltési hiba',
        message: 'Hiba történt a kép feltöltésekor.',
        type: 'error'
      })
    } finally {
      setUploading(false)
    }
  }

  const addPrice = () => {
    setSlide(prev => prev ? { ...prev, prices: [...prev.prices, { name: '', price: '' }] } : null)
  }

  const updatePrice = (index: number, field: string, value: string) => {
    setSlide(prev => {
      if (!prev) return null
      const newPrices = [...prev.prices]
      newPrices[index] = { ...newPrices[index], [field]: value }
      return { ...prev, prices: newPrices }
    })
  }

  const removePrice = (index: number) => {
    setSlide(prev => prev ? { ...prev, prices: prev.prices.filter((_, i) => i !== index) } : null)
  }

  if (loading) return (
    <div className="custom-view-wrapper">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#775a2b" />
      </div>
    </div>
  )

  return (
    <div className="custom-view-wrapper">
      <Sidebar />
      
      <main className="custom-admin-main">
        <div className="view-header">
          <div className="view-title" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <h1>{isNew ? 'Új Étlap' : 'Étlap Szerkesztése'}</h1>
            <div className="switch-card">
              <span className="switch-label">Megjelenítés</span>
              <div 
                className={`switch-container ${slide?.showOnHomepage ? 'active' : ''}`}
                onClick={() => setSlide(prev => prev ? { ...prev, showOnHomepage: !prev.showOnHomepage } : null)}
              >
                <div className="switch-handle" />
              </div>
            </div>
          </div>
        </div>

        <div className="edit-form-content">
          <div className="form-section">
            <div className="form-group">
              <label className="field-label">Étlap neve</label>
              <input 
                type="text" 
                className="field-input"
                value={slide?.name || ''}
                onChange={e => setSlide(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Pl. Ebéd ajánlatunk"
              />
            </div>

            <div className="form-group">
              <label className="field-label">Alcím / Rövid leírás</label>
              <textarea 
                className="field-textarea"
                value={slide?.description || ''}
                onChange={e => setSlide(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Pl. Friss, napi ajánlatunk minden nap 11 és 15 óra között."
              />
            </div>

            <div className="form-group">
              <label className="field-label">Kategória</label>
              <select 
                className="field-select"
                value={typeof slide?.category === 'object' ? slide.category.id : slide?.category || ''}
                onChange={e => setSlide(prev => prev ? { ...prev, category: e.target.value } : null)}
              >
                <option value="">Válassz kategóriát...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="field-label">Tételek / Árak</label>
              <div className="array-field-container">
                {slide?.prices.map((p, index) => (
                  <div key={index} className="array-item-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1rem', background: 'rgba(119, 90, 43, 0.03)', borderRadius: '12px', border: '1px solid rgba(119, 90, 43, 0.1)' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input 
                        type="text" 
                        className="field-input"
                        style={{ flex: 2 }}
                        value={p.name}
                        onChange={e => updatePrice(index, 'name', e.target.value)}
                        placeholder="Tétel neve (pl. Marhapörkölt)"
                      />
                      <input 
                        type="text" 
                        className="field-input"
                        style={{ flex: 1 }}
                        value={p.price}
                        onChange={e => updatePrice(index, 'price', e.target.value)}
                        placeholder="Ár (pl. 2450 Ft)"
                      />
                      <button className="remove-item-btn" onClick={() => removePrice(index)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <textarea 
                      className="field-textarea"
                      style={{ minHeight: '60px', fontSize: '0.9rem' }}
                      value={p.description || ''}
                      onChange={e => updatePrice(index, 'description', e.target.value)}
                      placeholder="Részletek, köret, összetevők..."
                    />
                  </div>
                ))}
                <button className="add-item-btn" onClick={addPrice}>
                  <Plus size={18} /> Új tétel hozzáadása
                </button>
              </div>
            </div>
          </div>

          <div className="image-preview-card">
            <label className="field-label">Háttérkép</label>
            <div className="sidebar-img-container" style={{ height: '250px' }}>
              {uploading ? (
                <Loader2 className="animate-spin" size={32} color="#775a2b" />
              ) : slide?.backgroundImage ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image 
                    src={typeof slide.backgroundImage === 'object' ? slide.backgroundImage.url : ''} 
                    alt="Preview" 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{ color: 'rgba(119, 90, 43, 0.3)', fontWeight: 800 }}>Nincs kép</div>
              )}
            </div>
            
            <label className="upload-overlay-btn">
              <Upload size={18} />
              {slide?.backgroundImage ? 'Kép cseréje' : 'Kép feltöltése'}
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className="editor-footer">
          <button 
            type="button"
            className="cancel-btn"
            onClick={() => router.push('/admin/custom-slides')}
          >
            Mégse
          </button>
          <button 
            type="button"
            className="save-btn"
            onClick={handleSave}
            disabled={saving || uploading}
          >
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? 'Mentés...' : 'Változtatások Mentése'}
            </div>
          </button>
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
