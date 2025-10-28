import React, { useEffect, useRef } from 'react'

export default function Modal({ title, children, onClose, actions, labelledBy }) {
    const dialogRef = useRef(null);
    const previousActive = useRef(null);
    const onCloseRef = useRef(onClose);

      // keep latest onClose in ref (no effect dependency needed)
  onCloseRef.current = onClose;

    useEffect(() => {
        previousActive.current = document.activeElement;
        const first = dialogRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        first?.focus()

        const onKey = (e) => {
            if (e.key === 'Escape') onCloseRef.current?.();
            else if (e.key === 'Tab') {
                // very small focus-trap: loop within modal
                const focusable = dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
                if (!focusable.length) return
                const firstEl = focusable[0]
                const lastEl = focusable[focusable.length - 1]
                if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
                else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
            }
        }

        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
            previousActive.current?.focus()
        }
    }, [])

    const handleOverlayClick = () => onCloseRef.current?.();

    return (
        <div className="modal-overlay" role="presentation" onClick={handleOverlayClick} aria-hidden>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={dialogRef} onClick={(e) => e.stopPropagation()}>
                <h3 id={labelledBy}>{title}</h3>
                <div>{children}</div>
                <div className="modal-actions">
                    {actions}
                </div>
            </div>
        </div>
    )
}