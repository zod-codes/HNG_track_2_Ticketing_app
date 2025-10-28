import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function Signup() {
    const { signup, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [errors, setErrors] = useState({})

    useEffect(() => { if (isAuthenticated) navigate('/dashboard') }, [isAuthenticated, navigate])

    useEffect(() => {
        const e = {}
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email'
        if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 chars'
        if (form.name && form.name.length < 2) e.name = 'Name must be at least 2 characters'
        setErrors(e)
    }, [form])

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = {}
        if (!form.name) newErrors.name = 'Full name is required'
        if (!form.email) newErrors.email = 'Email is required'
        if (!form.password) newErrors.password = 'Password is required'
        if (Object.keys(newErrors).length) { setErrors(newErrors); toast.show('Please fix the errors before submitting', 'error'); return }

        const res = signup(form.name, form.email, form.password)
        if (!res.ok) toast.show(res.message || 'Failed to create account', 'error')
        else navigate('/dashboard')
    }

    return (
        <div className="app">
            <Header />
            <main className="auth-page">
                <div className="auth-circle-1" aria-hidden></div>
                <div className="auth-circle-2" aria-hidden></div>
                <form className="auth-container" onSubmit={handleSubmit} noValidate>
                    <h2>Create Account</h2>
                    <p className="subtitle">Get started with TicketFlow today</p>

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input name="name" aria-invalid={!!errors.name} aria-describedby="name-error" className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        {errors.name && <div id="name-error" className="error-message">⚠ {errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input name="email" aria-invalid={!!errors.email} aria-describedby="email-error" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        {errors.email && <div id="email-error" className="error-message">⚠ {errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input name="password" type="password" aria-invalid={!!errors.password} aria-describedby="pw-error" className={`form-input ${errors.password ? 'error' : ''}`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        {errors.password && <div id="pw-error" className="error-message">⚠ {errors.password}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>

                    <p className="auth-link">Already have an account? <a href="/auth/login">Sign in</a></p>
                </form>
            </main>
            <Footer />
        </div>
    )
}