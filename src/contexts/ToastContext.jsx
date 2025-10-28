/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useRef, useCallback } from 'react'
export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  // const clear = useCallback(() => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //     timeoutRef.current = null;
  //   };
  //   setToast(null);
  // }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const show = useCallback((message, type = 'success', duration = 5000) => {
    if (typeof message !== 'string') {
      console.error('Toast message must be a string')
      return;
    }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToast({ id, message, type });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToast(null)
      timeoutRef.current = null
    }, duration)
  }, [])

  const remove = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    };
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ show, remove, toast }}>
      {children}
      {toast && (
        <div aria-live="polite" aria-atomic="true" className="toast-container">
          <div key={toast.id} role="status" className={`toast toast-${toast.type}`} onClick={remove}>
            <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
            <span style={{ marginLeft: 8 }}>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}