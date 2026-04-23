'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, User as UserIcon, Lock } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Modal } from './Modal'

interface User {
  id: string
  email: string
  createdAt: string
}

export const UserEditView: React.FC<{ params: { id: string } }> = (props) => {
  const router = useRouter()
  
  // Robust ID extraction
  let id = props.params?.id
  if (!id && typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    if (lastSegment && lastSegment !== 'custom-users') {
      id = lastSegment
    }
  }

  const [user, setUser] = useState<User | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    if (isNew) {
      setUser({
        id: '',
        email: '',
        createdAt: new Date().toISOString()
      })
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${id}`)
      if (!res.ok) throw new Error('Nem sikerült betölteni a felhasználót')
      const data = await res.json()
      setUser(data)
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

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const url = isNew ? '/api/users' : `/api/users/${id}`
      const method = isNew ? 'POST' : 'PATCH'
      
      const submitData: Record<string, unknown> = {
        email: user.email,
      }
      
      if (password) {
        submitData.password = password
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials: 'same-origin',
      })

      if (!res.ok) {
        const err = await res.json()
        const detail = err.errors?.[0]?.message || 'Sikertelen mentés'
        throw new Error(detail)
      }

      setModalConfig({
        isOpen: true,
        title: 'Sikeres mentés',
        message: 'A felhasználó adatai sikeresen frissítésre kerültek.',
        type: 'success',
        onConfirm: () => router.push('/admin/custom-users')
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
            <h1>{isNew ? 'Új Felhasználó' : 'Felhasználó Szerkesztése'}</h1>
          </div>
        </div>

        <div className="edit-form-content">
          <div className="form-section">
            <div className="form-group">
              <label className="field-label">Email cím</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#775a2b' }}>
                  <UserIcon size={18} />
                </div>
                <input 
                  type="email" 
                  className="field-input"
                  style={{ paddingLeft: '3rem' }}
                  value={user?.email || ''}
                  onChange={e => setUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  placeholder="pelda@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">
                {isNew ? 'Jelszó' : 'Új Jelszó (hagyd üresen, ha nem változik)'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#775a2b' }}>
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  className="field-input"
                  style={{ paddingLeft: '3rem' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isNew && (
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="field-label">Létrehozva</label>
                <div style={{ color: '#775a2b', fontWeight: 600 }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('hu-HU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '-'}
                </div>
              </div>
            )}
          </div>

          <div className="image-preview-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
             <UserIcon size={120} strokeWidth={1} />
             <p style={{ marginTop: '1rem', fontWeight: 700 }}>FELHASZNÁLÓI PROFIL</p>
          </div>
        </div>

        <div className="editor-footer">
          <button 
            type="button"
            className="cancel-btn"
            onClick={() => router.push('/admin/custom-users')}
          >
            Mégse
          </button>
          <button 
            type="button"
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
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
