import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
    const { isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    return (
        <header className="header" role="banner">
            <div className="container header-inner">
                <div className="logo" onClick={() => navigate('/')}>TicketFlow</div>
                <nav className="nav-links" aria-label="Main navigation">
                    <Link to="/">Home</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/tickets">Tickets</Link>
                            <button type="button" className="btn btn-danger btn-small" onClick={() => { logout(); navigate('/') }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login">Login</Link>
                            <Link to="/auth/signup" className="btn btn-primary">Sign up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}