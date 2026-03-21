'use client'

import React from 'react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: 'confirm' | 'success' | 'error' | 'info'
  confirmText?: string
  cancelText?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'Rendben',
  cancelText = 'Mégse'
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'confirm': return <AlertTriangle size={40} />
      case 'success': return <CheckCircle size={40} color="#775a2b" />
      case 'error': return <XCircle size={40} color="#d94e33" />
      default: return <Info size={40} color="#775a2b" />
    }
  }

  const isConfirm = type === 'confirm'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">
          {getIcon()}
        </div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-text">{message}</p>
        <div className="modal-actions">
          {isConfirm && (
            <button className="modal-btn cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button 
            className={`modal-btn ${isConfirm ? 'confirm' : 'success'}`} 
            onClick={onConfirm || onClose}
          >
            {isConfirm ? confirmText : 'Bezárás'}
          </button>
        </div>
      </div>
    </div>
  )
}
