'use client'

import React, { useEffect, useState } from 'react'
import { Plus, ChevronRight, Trash2, Check } from 'lucide-react'
import Link from 'next/link'
import { Sidebar } from './Sidebar'
import { Modal } from './Modal'

interface User {
  id: string
  email: string
  createdAt: string
}

export const CustomUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users?limit=100')
      const data = await response.json()
      setUsers(data.docs)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(users.map(u => u.id))
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
        selectedIds.map(id => fetch(`/api/users/${id}`, { method: 'DELETE' }))
      )
      
      const allOk = results.every(res => res.ok)
      if (!allOk) {
        throw new Error('Néhány felhasználót nem sikerült törölni. Ellenőrizd a jogosultságokat!')
      }

      setUsers(prev => prev.filter(u => !selectedIds.includes(u.id)))
      setSelectedIds([])
      setModalConfig({
        isOpen: true,
        title: 'Sikeres törlés',
        message: 'A kijelölt felhasználókat sikeresen eltávolítottuk.',
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

  const formatDate = (dateString: string) => {
    try {
       const date = new Date(dateString);
       return date.toLocaleDateString('hu-HU', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: '2-digit',
         minute: '2-digit'
       });
    } catch {
      return dateString;
    }
  }

  return (
    <div className="custom-view-wrapper">
      <Sidebar />
      
      <main className="custom-admin-main">
        <div className="view-header">
          <div className="view-title">
            <h1>Felhasználók</h1>
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
                     message: `Kijelöltél ${selectedIds.length} felhasználót. Ez a művelet nem vonható vissza.`,
                     type: 'confirm',
                     onConfirm: handleDelete
                   })}
                >
                  <Trash2 size={20} />
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#775a2b' }}>
                  {selectedIds.length} kijelölve
                </span>
              </div>
            )}
            <Link 
            href="/admin/custom-users/create"
            className="add-new-btn"
          >
            <Plus size={18} />
            Új felhasználó hozzáadása
          </Link>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '5rem', textAlign: 'center', color: '#775a2b', fontSize: '1.5rem', fontWeight: 800 }}>
              Felhasználók betöltése...
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <div 
                      className={`checkbox-container ${selectedIds.length === users.length ? 'checked' : ''}`}
                      onClick={toggleSelectAll}
                    >
                      {selectedIds.length === users.length && <Check size={14} color="white" />}
                    </div>
                  </th>
                  <th>Email cím</th>
                  <th>Létrehozva</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`category-row ${selectedIds.includes(user.id) ? 'selected' : ''}`}
                  >
                    <td>
                      <div 
                        className={`checkbox-container ${selectedIds.includes(user.id) ? 'checked' : ''}`}
                        onClick={() => toggleSelect(user.id)}
                      >
                        {selectedIds.includes(user.id) && <Check size={14} color="white" />}
                      </div>
                    </td>
                    <td className="name-cell">{user.email}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <Link 
                        href={`/admin/custom-users/${user.id}`}
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
