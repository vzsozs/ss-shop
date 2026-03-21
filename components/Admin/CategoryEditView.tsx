'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Sidebar } from './Sidebar'
import { Modal } from './Modal'

interface Category {
  id: string
  name: string
  description: string
  image: {
    id: string
    url: string
  } | string | null
  ctaType: string
}

export const CategoryEditView: React.FC<{ params: { id: string } }> = (props) => {
  const router = useRouter()
  
  // Robust ID extraction
  let id = props.params?.id
  
  if (!id && typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    if (lastSegment && lastSegment !== 'custom-categories') {
      id = lastSegment
    }
  }

  const [category, setCategory] = useState<Category | null>(null)
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

  const fetchCategory = useCallback(async () => {
    console.log('Fetching category with ID:', id)
    if (!id || id === 'create') {
      console.log('Creating new category mode')
      setCategory({
        id: '',
        name: '',
        description: '',
        image: null,
        ctaType: 'none'
      })
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/categories/${id}`)
      console.log('Fetch response status:', res.status)
      if (!res.ok) {
        const errText = await res.text()
        console.error('Fetch error response:', errText)
        throw new Error(`Nem sikerült betölteni a kategóriát (Status: ${res.status})`)
      }
      const data = await res.json()
      console.log('Fetched data:', data)
      setCategory(data)
    } catch (err) {
      console.error('Hiba a betöltés során:', err)
      setModalConfig({
        isOpen: true,
        title: 'Hiba a betöltés során',
        message: err instanceof Error ? err.message : 'Ismeretlen hiba a betöltés során',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  const handleSave = async () => {
    if (!category) return
    setSaving(true)
    try {
      const url = isNew ? '/api/categories' : `/api/categories/${id}`
      const method = isNew ? 'POST' : 'PATCH'
      
      // Prepare data (extract image ID)
      const submitData: Record<string, unknown> = { ...category }
      // Remove id from submitData if it's empty
      if (isNew) delete submitData.id

      if (typeof submitData.image === 'object' && submitData.image !== null) {
        submitData.image = (submitData.image as { id: string }).id
      }

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
        message: 'A kategória adatai sikeresen frissítésre kerültek.',
        type: 'success',
        onConfirm: () => router.push('/admin/custom-categories')
      })
    } catch (error: unknown) {
      console.error('Mentési hiba:', error)
      const message = error instanceof Error ? error.message : 'Ismeretlen hiba történt a mentés során.'
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
    formData.append('alt', category?.name || 'Category Image')

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Sikertelen képfeltöltés')
      
      const media = await res.json()
      setCategory(prev => prev ? { ...prev, image: media.doc } : null)
    } catch (err) {
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
          <div className="view-title">
            <h1>{isNew ? 'Új Kategória' : 'Kategória Szerkesztése'}</h1>
          </div>
        </div>

        <div className="edit-form-content">
          <div className="form-section">
            <div className="form-group">
              <label className="field-label">Kategória neve</label>
              <input 
                type="text" 
                className="field-input"
                value={category?.name || ''}
                onChange={e => setCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Pl. Szendvicsek"
              />
            </div>

            <div className="form-group">
              <label className="field-label">Rövid leírás</label>
              <textarea 
                className="field-textarea"
                value={category?.description || ''}
                onChange={e => setCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="A kategória rövid bemutatása..."
              />
            </div>

            <div className="form-group">
              <label className="field-label">CTA Gomb Típusa</label>
              <select 
                className="field-select"
                value={category?.ctaType || 'none'}
                onChange={e => setCategory(prev => prev ? { ...prev, ctaType: e.target.value } : null)}
              >
                <option value="none">Nincs gomb</option>
                <option value="order">Szendvicsek (Rendelés)</option>
                <option value="drink">Itallap</option>
                <option value="contact">Kapcsolat</option>
              </select>
            </div>
          </div>

          <div className="image-preview-card">
            <label className="field-label">Kategória képe</label>
            <div className="sidebar-img-container">
              {uploading ? (
                <Loader2 className="animate-spin" size={32} color="#775a2b" />
              ) : category?.image ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image 
                    src={typeof category.image === 'object' && category.image !== null ? (category.image as { url: string }).url : ''} 
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
              {category?.image ? 'Kép cseréje' : 'Kép feltöltése'}
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
            onClick={() => router.push('/admin/custom-categories')}
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
