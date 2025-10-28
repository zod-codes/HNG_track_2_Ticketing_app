import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import { useTickets } from '../hooks/useTickets'

export default function Tickets() {
    const { tickets, addTicket, updateTicket, deleteTicket } = useTickets()
    const [showModal, setShowModal] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [current, setCurrent] = useState(null) // editing ticket or null
    const [toDeleteId, setToDeleteId] = useState(null)
    const [form, setForm] = useState({ title: '', description: '', status: 'open', priority: '' })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        // real-time validation
        const e = {}
        if (form.title && form.title.trim().length === 0) e.title = 'Title cannot be empty'
        if (form.status && !['open', 'in_progress', 'closed'].includes(form.status)) e.status = 'Invalid status'
        setErrors(e)
    }, [form])

    const openCreate = () => { setCurrent(null); setForm({ title: '', description: '', status: 'open', priority: '' }); setShowModal(true) }
    const openEdit = (t) => { setCurrent(t); setForm({ title: t.title, description: t.description, status: t.status, priority: t.priority || '' }); setShowModal(true) }

    const handleSubmit = () => {
        const newErrors = {}
        if (!form.title || form.title.trim() === '') newErrors.title = 'Title is required'
        if (!form.status) newErrors.status = 'Status is required'
        if (!['open', 'in_progress', 'closed'].includes(form.status)) newErrors.status = 'Status must be: open, in_progress, closed'
        if (Object.keys(newErrors).length) { setErrors(newErrors); return }

        if (current) updateTicket(current.id, form)
        else addTicket(form)
        setShowModal(false)
    }

    const confirmDelete = (id) => { setToDeleteId(id); setShowDelete(true) }
    const handleDelete = () => { deleteTicket(toDeleteId); setShowDelete(false); setToDeleteId(null) }

    return (
        <div className="app">
            <Header />
            <main className="dashboard">
                <div className="container" id='ticket-container'>
                    <div className="ticket-header">
                        <h1 className="dashboard-title">Ticket Management</h1>
                        <button type="button" className="btn btn-primary" onClick={openCreate}><strong style={{ fontWeight: 800, marginRight: '5px' }}>+</strong> New Ticket</button>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="empty-state"><h3>No Tickets Yet</h3><p>Create your first ticket to get started</p></div>
                    ) : (
                        <div className="ticket-list">
                            {tickets.map(t => (
                                <article
                                    key={t.id}
                                    className={`ticket-card ${t.status}`}
                                    aria-labelledby={`ticket-${t.id}-title`}
                                >
                                    <div className="ticket-header-row">
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                                <div>
                                                    <h4 id={`ticket-${t.id}-title`} className="ticket-title">{t.title}</h4>

                                                    {/* severity / priority badge + optional small meta row */}
                                                    <div className="ticket-meta" style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                                        <span
                                                            className={`ticket-severity ${t.priority ? `severity-${t.priority}` : 'severity-none'}`}
                                                            aria-label={t.priority ? `Priority ${t.priority}` : 'Priority unspecified'}
                                                        >
                                                            {t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Unspecified'}
                                                        </span>

                                                        {/* you can leave the description here or below */}
                                                        <span className="ticket-description" style={{ color: 'var(--color-muted)', fontSize: 14 }}>
                                                            {t.description ? t.description : 'No description'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className={`ticket-status ${t.status}`} aria-hidden>
                                                    {t.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ticket-actions" style={{ marginTop: 12 }}>
                                        <button type="button" className="btn btn-primary btn-small" onClick={() => openEdit(t)}>Edit</button>
                                        <button type="button" className="btn btn-danger btn-small" onClick={() => confirmDelete(t.id)}>Delete</button>
                                    </div>
                                </article>
                            ))}

                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <Modal title={current ? 'Edit Ticket' : 'Create New Ticket'} labelledBy="ticket-modal-title" onClose={() => setShowModal(false)} actions={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>{current ? 'Update' : 'Create'} Ticket</button>
                    </>}>
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input aria-invalid={!!errors.title} className={`form-input ${errors.title ? 'error' : ''}`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        {errors.title && <div className="error-message">⚠ {errors.title}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status *</label>
                        <select className={`form-select ${errors.status ? 'error' : ''}`} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="closed">Closed</option>
                        </select>
                        {errors.status && <div className="error-message">⚠ {errors.status}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                            <option value="">Select Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </Modal>
            )}

            {showDelete && (
                <Modal title="Delete Ticket" labelledBy="delete-modal-title" onClose={() => setShowDelete(false)} actions={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </>}>
                    <p style={{ color: '#64748b' }}>Are you sure you want to delete this ticket? This action cannot be undone.</p>
                </Modal>
            )}

            <Footer />
        </div>
    )
}