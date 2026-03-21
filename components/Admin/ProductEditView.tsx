'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, Save, Plus, Trash2, Bold, Italic, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'
import { Sidebar } from './Sidebar'
import { Modal } from './Modal'

interface Product {
  id: string
  name: string
  description: Record<string, unknown> | string | null
  price: number
  category: string | { id: string, name: string }
  unit: string
  features: { feature: string, value: string }[]
  image: { id: string, url: string } | string | null
  showInSlider: boolean
  slug: string
}

interface Category {
  id: string
  name: string
}

export const ProductEditView: React.FC<{ params: { id: string } }> = (props) => {
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  
  // Robust ID extraction
  let id = props.params?.id
  if (!id && typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    if (lastSegment && lastSegment !== 'custom-products') {
      id = lastSegment
    }
  }

  const [product, setProduct] = useState<Product | null>(null)
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

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch categories for the dropdown
      const catRes = await fetch('/api/categories?limit=100')
      if (catRes.ok) {
        const catData = await catRes.json()
        setCategories(catData.docs || [])
      }

      if (isNew) {
        setProduct({
          id: '',
          name: '',
          description: '',
          price: 0,
          category: '',
          unit: 'db',
          features: [],
          image: null,
          showInSlider: false,
          slug: ''
        })
      } else {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Nem sikerült betölteni a terméket')
        const data = await res.json()
        setProduct(data)
        
        // If description is Lexical JSON, we might need a converter
        // For now, if it's text, we'll show it
      }
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
    fetchData()
  }, [fetchData])

  // Initialize editor content when product data is loaded
  useEffect(() => {
    if (product?.description && editorRef.current && (editorRef.current.innerHTML === '' || editorRef.current.innerHTML === '<p><br></p>')) {
      const lexicalToHtml = (json: Record<string, unknown>) => {
        if (!json || !json.root) return ''
        const root = json.root as { children?: unknown[] }
        if (!root.children) return ''
        
        return root.children.map((child) => {
          const c = child as { type?: string, children?: { text?: string, format?: number }[], tag?: string }
          if (c.type === 'paragraph') {
            const textContent = c.children?.map((t) => {
              let text = t.text || ''
              if (t.format === 1) text = `<b>${text}</b>`
              if (t.format === 2) text = `<i>${text}</i>`
              return text
            }).join('') || ''
            return `<p>${textContent}</p>`
          }
          return ''
        }).join('')
      }
      
      const content = typeof product.description === 'object' 
        ? lexicalToHtml(product.description as Record<string, unknown>) 
        : product.description
      
      editorRef.current.innerHTML = content
    }
  }, [product])

  const handleSave = async () => {
    if (!product) return
    setSaving(true)
    try {
      const url = isNew ? '/api/products' : `/api/products/${id}`
      const method = isNew ? 'POST' : 'PATCH'
      
      const submitData: Record<string, unknown> = { ...product }
      if (isNew) delete (submitData as { id?: string }).id

      // Extract IDs for relationships
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

      submitData.category = getID(product.category)
      submitData.image = getID(product.image)

      // Handle RichText (Description)
      if (editorRef.current) {
        const parseHTMLToLexical = (element: HTMLElement) => {
          const nodes: { type: string, text: string, format: number, version: 1 }[] = []
          const traverse = (node: Node, currentFormat = 0) => {
            if (node.nodeType === Node.TEXT_NODE) {
              if (node.textContent) {
                nodes.push({
                  type: 'text',
                  text: node.textContent,
                  format: currentFormat,
                  version: 1
                })
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement
              let newFormat = currentFormat
              const tag = el.tagName.toLowerCase()
              if (tag === 'b' || tag === 'strong') newFormat |= 1
              if (tag === 'i' || tag === 'em') newFormat |= 2
              if (tag === 'u') newFormat |= 8
              
              el.childNodes.forEach(child => traverse(child, newFormat))
            }
          }
          
          element.childNodes.forEach(child => traverse(child))
          return nodes
        }

        submitData.description = {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: parseHTMLToLexical(editorRef.current)
              }
            ]
          }
        };
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('Payload validation error:', err)
        const detail = err.errors?.[0]?.message || 'Sikertelen mentés'
        throw new Error(detail)
      }

      setModalConfig({
        isOpen: true,
        title: 'Sikeres mentés',
        message: 'A termék adatai sikeresen frissítésre kerültek.',
        type: 'success',
        onConfirm: () => router.push('/admin/custom-products')
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
    formData.append('alt', product?.name || 'Product Image')

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Sikertelen képfeltöltés')
      const media = await res.json()
      setProduct(prev => prev ? { ...prev, image: media.doc } : null)
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

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value)
  }

  const addFeature = () => {
    setProduct(prev => prev ? { ...prev, features: [...prev.features, { feature: '', value: '' }] } : null)
  }

  const updateFeature = (index: number, key: 'feature' | 'value', value: string) => {
    setProduct(prev => {
      if (!prev) return null
      const newFeatures = [...prev.features]
      newFeatures[index] = { ...newFeatures[index], [key]: value }
      return { ...prev, features: newFeatures }
    })
  }

  const removeFeature = (index: number) => {
    setProduct(prev => prev ? { ...prev, features: prev.features.filter((_, i) => i !== index) } : null)
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="view-title">
              <h1>{isNew ? 'Új Termék' : 'Termék Szerkesztése'}</h1>
            </div>
            <div className="switch-card">
              <span className="switch-label">Megjelenítés</span>
              <div 
                className={`switch-container ${product?.showInSlider ? 'active' : ''}`}
                onClick={() => setProduct(prev => prev ? { ...prev, showInSlider: !prev.showInSlider } : null)}
              >
                <div className="switch-handle" />
              </div>
            </div>
          </div>
        </div>

        <div className="edit-form-content">
          <div className="form-section">
            <div className="form-group">
              <label className="field-label">Terméknév</label>
              <input 
                type="text" 
                className="field-input"
                value={product?.name || ''}
                onChange={e => setProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Pl. Sonkás Szendvics"
              />
            </div>

            <div className="form-group">
              <label className="field-label">Leírás</label>
              <div className="richtext-editor-container">
                <div className="richtext-toolbar">
                  <button className="toolbar-btn" onClick={() => execCommand('bold')} title="Félkövér"><Bold size={16} /></button>
                  <button className="toolbar-btn" onClick={() => execCommand('italic')} title="Dőlt"><Italic size={16} /></button>
                  <button className="toolbar-btn" onClick={() => {
                    const url = prompt('URL cím:')
                    if (url) execCommand('createLink', url)
                  }} title="Link"><LinkIcon size={16} /></button>
                </div>
                <div 
                  ref={editorRef}
                  className="richtext-content" 
                  contentEditable 
                  suppressContentEditableWarning
                  onBlur={e => {
                    const html = e.currentTarget.innerHTML
                    setProduct(prev => prev ? { ...prev, description: html } : null)
                  }}
                >
                  {/* We need a proper way to handle initial Lexical JSON here if needed */}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="form-group">
                <label className="field-label">Ár (Ft)</label>
                <input 
                  type="number" 
                  className="field-input"
                  value={product?.price || 0}
                  onChange={e => setProduct(prev => prev ? { ...prev, price: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="form-group">
                <label className="field-label">Kiszerelés</label>
                <select 
                  className="field-select"
                  value={product?.unit || 'db'}
                  onChange={e => setProduct(prev => prev ? { ...prev, unit: e.target.value } : null)}
                >
                  <option value="db">Darab (db)</option>
                  <option value="kg">Kilogramm (kg)</option>
                  <option value="g">Gramm (g)</option>
                  <option value="l">Liter (l)</option>
                  <option value="dl">Deciliter (dl)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Kategória</label>
              <select 
                className="field-select"
                value={typeof product?.category === 'object' ? product?.category?.id : product?.category || ''}
                onChange={e => setProduct(prev => prev ? { ...prev, category: e.target.value } : null)}
              >
                <option value="">Válassz kategóriát...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="field-label">Tulajdonságok</label>
              <div className="array-field-container">
                {product?.features.map((feat, index) => (
                  <div key={index} className="array-item-row" style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
                    <input 
                      type="text" 
                      className="field-input array-input"
                      value={feat.feature}
                      onChange={e => updateFeature(index, 'feature', e.target.value)}
                      placeholder="Név (pl. Tápérték)"
                      style={{ flex: 1 }}
                    />
                    <input 
                      type="text" 
                      className="field-input array-input"
                      value={feat.value}
                      onChange={e => updateFeature(index, 'value', e.target.value)}
                      placeholder="Érték (pl. 1350kJ)"
                      style={{ flex: 1 }}
                    />
                    <button className="remove-item-btn" onClick={() => removeFeature(index)} style={{ flexShrink: 0 }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button className="add-item-btn" onClick={addFeature}>
                  <Plus size={18} /> Új tulajdonság hozzáadása
                </button>
              </div>
            </div>

          </div>

          <div className="image-preview-card">
            <label className="field-label">Termék képe</label>
            <div className="sidebar-img-container">
              {uploading ? (
                <Loader2 className="animate-spin" size={32} color="#775a2b" />
              ) : product?.image ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image 
                    src={typeof product.image === 'object' && product.image !== null ? (product.image as { url: string }).url : ''} 
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
              {product?.image ? 'Kép cseréje' : 'Kép feltöltése'}
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </label>

            <div className="form-group" style={{ marginTop: '2rem', textAlign: 'left' }}>
              <label className="field-label">Slug (URL azonosító)</label>
              <input 
                type="text" 
                className="field-input"
                value={product?.slug || ''}
                onChange={e => setProduct(prev => prev ? { ...prev, slug: e.target.value } : null)}
                placeholder="szendvics-neve"
                style={{ background: 'white' }}
              />
            </div>
          </div>
        </div>

        <div className="editor-footer">
          <button 
            type="button"
            className="cancel-btn"
            onClick={() => router.push('/admin/custom-products')}
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
