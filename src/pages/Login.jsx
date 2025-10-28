import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function Login() {
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})

    useEffect(() => { if (isAuthenticated) navigate('/dashboard') }, [isAuthenticated, navigate])

    // real-time validation
    useEffect(() => {
        const e = {}
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email'
        if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 chars'
        setErrors(e)
    }, [form])

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = {}
        if (!form.email) newErrors.email = 'Email is required'
        if (!form.password) newErrors.password = 'Password is required'
        if (Object.keys(newErrors).length) { 
            setErrors(newErrors); 
            toast?.show?.('Please fix the errors before submitting', 'error'); 
            return; 
        };

        const res = login(form.email, form.password)
        if (!res.ok) toast?.show?.(res.message || 'Invalid credentials', 'error')
        else navigate('/dashboard')
    }

    return (
        <div className="app">
            <Header />
            <main className="auth-page">
                <div className="auth-circle-1" aria-hidden></div>
                <div className="auth-circle-2" aria-hidden></div>
                <form className="auth-container" onSubmit={handleSubmit} noValidate>
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Sign in to your account to continue</p>

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

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>

                    <p className="auth-link">Don't have an account? <a href="/auth/signup">Sign up</a></p>
                </form>
            </main>
            <Footer />
        </div>
    )
}